$(window).ready(function(){
    let prepareConfig = {
        instruction: "光芒绽放，注视训练场景內中心位置，可以引导孩子想像自己正在进入时空隧道，中心将出现水果，有固定在中心的目标水果，有向四周扩散的水果。点击与中心水果相同的水果将增加所积攒的积攒水果数量。看看你能积攒多少水果吧！",
        staticPath: "../../../static/",//该训练的html相对于static文件夹的路径
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
    //     staticPath: "../../../static/",//该训练的html相对于static文件夹的路径
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

        buildBG(){
            var config = {
                colors: ["#FF0000","#00FF00", "#0000FF", "#FF7E00", "#EA00FF", "#00FFFF"],
                time: 300,
                canvasID: "bg-canvas"
            }
            if(window.bloomBG) window.bloomBG.removeSelf();
            window.bloomBG = new BloomBG(config);
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
            window.fruitsID = ["apple", "cherry", "grape","lemon","orange","pear","pineapple"];

            let loadArr = [];
            loadArr.push(
                {id: "mBG", src: "../../../static/music/bg/s26.mp3"},
                {id: "wonderful", src: "../../../static/music/wonderful.mp3"},
                {id: "click", src: "../../../static/music/click/1.mp3"},
                {id: "numBG", src: "../src/st-bloom/img/num.png"}
            );
            window.fruitsID.forEach((fruitID)=>{
                loadArr.push({id: fruitID, src: "../src/st-bloom/img/"+ fruitID +".png"});
            });

            //加载
            gameResource.loadManifest(loadArr);
        }

        onLoadingComplete(){
            this.buildBG();
            this.stage.removeAllChildren();
            this.buildScore();
            this.buildWorld();//产生训练场景
            this.buildButtons();//产生训练按钮
            this.render();
            createjs.Sound.play("mBG", createjs.Sound.INTERRUPT_NONE,0,0,-1,0.5,0);
        }


        buildWorld(){
            if(this.world) this.stage.removeChild(this.world.view);
            this.world = new World(this);
            this.stage.addChildAt(this.world,1);
        }

        buildScore(){
            this.score = new babyEye.Score();
            this.stage.addChild(this.score.view);
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
            
            this.score.changeValue(value);
            if(this.score.value <= 1) this.score.setValue(1);
            this.buildWorld();
        }
    }

    class World extends createjs.Container {
        constructor(game) {
            super();
            this.game = game;
            this.lastFrame = 0;
            this.runningTime = 0;
            this.lastTargetTime = 0;
            this.lastFruitTime = 0;
            this.fruits = [];
            this.toRemove = [];
            this.targetScale = 0.5;
            this.beginFruit = false;
            setTimeout(()=>{
                this.beginFruit = true;
                this.buildTarget();
            }, 3000)
        }

        buildTarget(){
            if(this.target) this.removeChild(this.target);
            this.fruitIndex = babyEye.randomExcept(0, window.fruitsID.length, this.fruitIndex? this.fruitIndex:0);
            this.target = new Fruit(this, {
                fruitID: window.fruitsID[this.fruitIndex],
                isTarget: true,
                scale: this.targetScale
            });
            this.addChild(this.target);
            this.target.set({
                x: this.game.width/2,
                y: this.game.height/2
            });

            if(this.targetScale > 0.2) {
                this.targetScale -= 0.05;
            }
        }

        buildFruit(){
            let fruit = new Fruit(this, {
                fruitID: window.fruitsID[babyEye.randomRange(0, window.fruitsID.length)]
            });
            fruit.set({
                x: this.game.width/2,
                y: this.game.height/2
            });

            this.fruits.push(fruit);
            this.addChild(fruit);
        }

        update(dt) {
            this.fruits.forEach((fruit)=>{
                fruit.update(dt);
            })

            this.toRemove.forEach((item)=>{
                item.removeSelf();
            })

            if(this.beginFruit) {
                if(this.runningTime - this.lastTargetTime > 20000) {
                    this.buildTarget();
                    this.lastTargetTime = this.runningTime;
                }

                if(this.runningTime - this.lastFruitTime > 500) {
                    this.buildFruit();
                    this.lastFruitTime = this.runningTime;
                }
            }

            this.runningTime += dt;
        }
    }

    class Fruit extends createjs.Container {
        constructor(world, infor){
            super();
            this.world = world;
            this.infor = infor;
            this.angle = -Math.PI +  Math.PI * Math.random() * 2;
            this.v = 2;
            this.buildContent();
            if(!infor.isTarget) this.events();
        }

        events(){
            this.addEventListener("mousedown", (ev)=>{
                if(this.world.target.infor.fruitID == this.infor.fruitID) {
                    this.removeSelf();
                    this.world.game.score.changeValue(1);
                }
            })
        }

        buildContent(){
            this.content = new createjs.Bitmap(gameResource.getResult(this.infor.fruitID));
            this.set({
                regX: this.content.image.width/2,
                regY: this.content.image.height/2,
                scaleX: this.infor.scale? this.infor.scale: 0.5,
                scaleY: this.infor.scale? this.infor.scale: 0.5
            });



            this.content.hitArea = new createjs.Shape(
                new createjs.Graphics().beginFill("black").drawRect(0,0,this.content.image.width, this.content.image.height)
            );

            this.addChild(this.content);
        }

        update(dt) {
            if(this.scaleX < 1) {
                this.scaleY = this.scaleX += dt * 0.0001;
            }
            this.x += this.v * Math.cos(this.angle);
            this.y += this.v * Math.sin(this.angle);

            if(this.x > this.world.game.width +  100 
            || this.x < -100
            || this.y > this.world.game.height + 100
            || this.y < -100) {
                this.world.toRemove.push(this);
            }
        }

        removeSelf(){
            let index = this.world.fruits.indexOf(this);
            if(index === -1) return;
            this.world.fruits.splice(index,1);
            this.world.removeChild(this);
        }
    }
})