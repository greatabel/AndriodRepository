$(window).ready(function(){
    let prepareConfig = {
        instruction: "本训练为立体视训练，场景中有围绕着小老鼠的奶酪，请点击比老鼠凸的奶酪，当所有比老鼠凸的奶酪被吃掉后，关数升级，看看你能闯过多少关吧！",
        selectGlasses: true,//是否需要选择眼镜
        selectLazyEye: false,//是否需要选择差眼，如果该项为true，则必须让selectGlasses也为true，因为需要眼镜信息来计算目标的正确颜色。脱抑制用。
        selectDifficulty: false,//是否需要选择难度
        staticPath: "../../static/",//该训练的html相对于static文件夹的路径
        callback: (trainInfor)=>{// 完成选择后的回调函数，将开始训练放在其中，trainInfor是患者选择的结果
            //trainInfor.glasses为"rb"或"br"
            //trainInfor.difficulty为难度easy hard medium
            //targetInfor里面有color和filter，是脱抑制的目标颜色信息。打印看看
            console.log(trainInfor);
            init(trainInfor);//选择完成后，开始训练函数
        }
    }

    babyEye.prepareTrain(prepareConfig);//选择训练参数和说明展示

    //begin for develop--------------------------------
    // let prepareConfig = {
    //     staticPath: "../../static/",//该训练的html相对于static文件夹的路径
    //     callback: ()=>{
    //         let trainInfor = {
    //             glasses:"rb",
    //             difficulty: "easy",
    //             targetInfor:{color: "red", filter: new createjs.ColorFilter(1,0,0,1,255,0,0,0)}
    //         }
    //         init(trainInfor);//选择完成后，开始训练函数
    //     }
    // }

    // babyEye.prepareTrain(prepareConfig);
    //end for develop------------------------------------

    let log = console.log;
    //开始训练函数
    function init(trainInfor){
        window.game = new Game(trainInfor);
    }
    //声明训练资源
    let gameResource = null;

    class Game {
        constructor(trainInfor){
            this.trainInfor = trainInfor;
            this.stage = new createjs.Stage("game-canvas");
            this.stage.enableMouseOver();
            createjs.Touch.enable(this.stage);
            this.width = this.stage.canvas.width;
            this.height = this.stage.canvas.height;
            this.lastFrame = 0;
            if(gameResource){//如果已加载，不再重复加载
                this.onLoadingComplete();
            } else {
                this.loadResource();
            }
        }

        loadResource(){
            $("#loading").show();
            //训练资源第一次，唯一一次赋值
            gameResource = new createjs.LoadQueue();
            gameResource.installPlugin(createjs.Sound);

            //添加加载事件
            gameResource.addEventListener("complete", (ev)=>{
                $("#loading").hide();
                this.onLoadingComplete();
            });

            //加载资源路径
            let loadArr = [
                {id: "bg1", src: "../src2/ste-mouse-like-cheese/img/bg1.png"},
                {id: "cheese", src: "../src2/ste-mouse-like-cheese/img/cheese.png"},
                {id: "mouse-left", src: "../src2/ste-mouse-like-cheese/img/mouse-left.png"},
                {id: "success", src: "../src2/ste-mouse-like-cheese/img/mouse-eat.png"},
                {id: "mBG", src: "../../static/music/bg/s22.mp3"},
                {id: "wonderful", src: "../../static/music/wonderful.mp3"},
                {id: "wrong", src: "../../static/music/collision/1.mp3"},
                {id: "click", src: "../../static/music/click/1.mp3"}
            ];

            //加载
            gameResource.loadManifest(loadArr);
        }

        onLoadingComplete(){
            this.stage.removeAllChildren();
            this.buildBG();
            this.buildLevel();
            this.buildWorld();//产生训练场景
            this.buildButtons();//产生训练按钮
            this.render();
            createjs.Sound.play("mBG", createjs.Sound.INTERRUPT_NONE,0,0,-1,0.5,0);
        }

        buildBG(){
            let img = gameResource.getResult("bg1");
            let imgConverted = new babyEye.ImageSTE2({image:img, colors: this.trainInfor.glasses.split(""), delta:35});
            this.bg = new createjs.Bitmap(imgConverted);
            this.bg.set({x: -20})
            this.stage.addChild(this.bg);
        }


        buildWorld(){
            if(this.world) this.stage.removeChild(this.world.view);
            this.world = new World(this);
            this.stage.addChildAt(this.world.view,1);
        }

        buildLevel(){
            this.level = new babyEye.Level();
            this.stage.addChild(this.level.view);
        }

        buildButtons(){
            //参数为重新开始函数，返回类型bitmap
            this.replayButton = new babyEye.ReplayButton(()=>{
                this.replay();
            });
            this.helpButton = new babyEye.HelpButton(prepareConfig);//接受prepareConfig，返回类型bitmap

            this.stage.addChild(this.replayButton, this.helpButton);
        }


        render(timestamp = 0){
            if(this.pauseValue) return;
            if(this.failValue) return;

            let dt = timestamp - this.lastFrame;
            if(dt > 150 || dt < 0) dt = 0;
            this.lastFrame = timestamp;
            
            this.world.update(dt);
            this.stage.update();

            requestAnimationFrame((timestamp)=>{
                this.render(timestamp);
            })
        }

        pause(){
            this.pauseValue = true;
        }

        continue(){
            if(this.pauseValue){
                this.pauseValue = false;
                this.render();
            }
        }

        succeed(){
            if(!this.successBitmap) {
                let img = gameResource.getResult("success");
                this.successBitmap = new createjs.Bitmap(img);
                this.successBitmap.set({
                    x: this.width/2,
                    y: this.height/2,
                    regX: img.width/2,
                    regY: img.height/2,
                    scaleX: 1.5,
                    scaleY: 1.5
                })
                this.stage.addChild(this.successBitmap);

            }

            this.successBitmap.visible = true;
            
            setTimeout(()=>{
                this.successBitmap.visible = false;
            },1500);
        }

        fail(){
            this.stage.addChild(babyEye.failBitmap);
            setTimeout(()=>{
                this.stage.removeChild(babyEye.failBitmap);
            },1000);
        }

        replay(){
            $(window).unbind();//解绑事件
            this.stage.removeAllChildren();
            this.stage.removeAllEventListeners();
            this.pause();
            createjs.Sound.stop();
            babyEye.prepareTrain(prepareConfig);
        }

        changeLevel(value){
            if(value > 0){
                this.succeed();
                createjs.Sound.play("wonderful", createjs.Sound.INTERRUPT_NONE,0,0,0,1,0);
            } else {
                this.fail();
                createjs.Sound.play("wrong", createjs.Sound.INTERRUPT_NONE,0,0,0,1,0);
            }
            
            this.level.changeValue(value);
            if(this.level.value <= 1) this.level.setValue(1);
            this.buildWorld();
        }
    }

    class World {
        constructor(game){
            this.game = game;
            this.view = new createjs.Container();
            this.view.compositeOperation = "lighten";
            this.deltas = [5,20,35];
            this.cheeseArr = [];
            this.cheeseVelocity = 0.01;
            this.toRemove = [];
            this.buildMouse();
            this.buildCheese();

        }

        update(dt){
            this.cheeseContainer.rotation += dt * this.cheeseVelocity;
            this.cheeseArr.forEach((cheese)=>{
                cheese.view.rotation = -this.cheeseContainer.rotation;
                cheese.update(dt);
            })

            this.toRemove.forEach((item)=>{
                item.destroySelf();
            })
            this.toRemove = [];
        }

        buildMouse(){
            if(this.mouse) this.mouse.view.parent.removeChild(this.mouse.view);
            let delta = this.game.level.value * 5;
            if(delta > 30) delta = 30;
            this.mouse = new Mouse({
                world: this,
                colors: this.game.trainInfor.glasses.split("").reverse(),
                delta: delta 
            });
            this.view.addChild(this.mouse.view);
            this.mouse.view.set({x: this.game.width/2,y: this.game.height/2});
        }

        buildCheese(){
            this.cheeseArr = [];
            if(this.cheeseContainer) this.cheeseContainer.parent.removeChild(this.cheeseContainer);
            this.cheeseContainer = new createjs.Container();
            this.cheeseContainer.set({x: this.game.width/2, y: this.game.height/2});

            this.cheeseArr.forEach((cheese)=>{
                cheese.view.parent.removeChild(cheese.view);
            })

            this.specialCheese = new Cheese({
                world: this,
                colors: this.mouse.colors,
                delta: this.mouse.delta + 15
            })
            this.cheeseArr.push(this.specialCheese);

            for(let i = 0; i < 5; i++){
                let cheese = new Cheese({
                    world: this,
                    colors: Math.random()<0.5? ["r","b"]: ["b","r"],
                    delta: this.deltas[babyEye.randomRange(0, this.deltas.length)]
                });
                this.cheeseArr.push(cheese);
            }

            babyEye.shuffle(this.cheeseArr);

            let r = 300;
            this.cheeseArr.forEach((cheese, index)=>{
                let x = r * Math.cos( 2 * Math.PI/6 * index);
                let y = r * Math.sin( 2 * Math.PI/6 * index);

                cheese.setPosition(x,y);

                this.cheeseContainer.addChild(cheese.view);
            })

            this.view.addChild(this.cheeseContainer);
        }

        events(){
            $(window).unbind("keydown");
            $(window).bind("keydown",(ev)=>{
            })
        }

        handleMousedown(cheese){
            if(cheese.colors[0] == this.mouse.colors[0] && cheese.delta > this.mouse.delta){
                cheese.toOrigin = true;
                createjs.Sound.play("click", createjs.Sound.INTERRUPT_NONE,0,0,0,1,0);
            } else {
                this.game.changeLevel(-1);
            };
        }

        checkAllCheese(){
            let index = this.cheeseArr.findIndex((cheese)=>{
                return cheese.colors[0]==this.mouse.colors[0] && cheese.delta > this.mouse.delta;
            })
            if(index == -1) {
                this.game.changeLevel(1);
            }
        }
    }

    class Mouse {
        constructor(config){
            this.world = config.world;
            this.game = this.world.game;
            this.colors = config.colors;
            this.delta = config.delta;
            this.buildView();
        }

        update(dt){

        }

        buildView(){
            this.view = new createjs.Container();
            let img = gameResource.getResult("mouse-left");
            let imgConverted = new babyEye.ImageSTE2({image:img, colors:this.colors, delta:this.delta});
            let imgMidConverted = new babyEye.ImageMidSTE({image:img, colors:this.colors, delta:this.delta});
            this.content = new createjs.Bitmap(imgConverted);
            this.contentMid = new createjs.Bitmap(imgMidConverted);
            this.contentMid.set({compositeOperation: "source-over"});
            this.view.addChild(this.content, this.contentMid);


            this.view.set({
                regX: (img.width + this.delta)/2,
                regY: img.height/2
            })
        }
    }

    class Cheese {
        constructor(config){
            this.world = config.world;
            this.game = this.world.game;
            this.colors = config.colors;
            this.delta = config.delta;
            this.buildView();
            this.events();
        }

        update(dt){
            if(this.toOrigin){
                this.view.x += dt * this.vx;
                this.view.y += dt * this.vy;

                if(-10 < this.view.x &&this.view.x < 10 
                   && -10 < this.view.y && this.view.y < 10) {
                       this.world.toRemove.push(this);
                   }
            }
        }

        buildView(){
            this.view = new createjs.Container();
            let img = gameResource.getResult("cheese");
            let imgConverted = new babyEye.ImageSTE2({image:img, colors:this.colors, delta: this.delta});

            let imgMidConverted = new babyEye.ImageMidSTE({image:img, colors:this.colors, delta: this.delta});
            this.content = new createjs.Bitmap(imgConverted);
            this.contentMid = new createjs.Bitmap(imgMidConverted);
            this.contentMid.set({compositeOperation: "source-over", alpha: 0});
            this.view.addChild(this.content, this.contentMid);

            this.view.set({
                regX: (img.width + this.delta)/2,
                regY: img.height/2
            })
        }

        setPosition(x,y){
            this.view.set({
                x:x,
                y:y
            })
            this.vx = -x * 0.001;
            this.vy = -y * 0.001;
        }

        destroySelf(){
            let index = this.world.cheeseArr.indexOf(this);
            if(index != -1) {
                this.world.cheeseArr.splice(index,1);
                this.view.parent.removeChild(this.view);
                this.world.checkAllCheese();
            }
        }

        events(){
            this.view.addEventListener("mousedown",(ev)=>{
                this.world.handleMousedown(this);
            });
        }
    }
})