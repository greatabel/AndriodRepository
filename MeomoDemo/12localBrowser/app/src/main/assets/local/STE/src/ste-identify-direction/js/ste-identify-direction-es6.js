$(window).ready(function(){
    let prepareConfig = {
        instruction: "训练场景內有很多小E字标，这些小的E字标组成了一个凸起的大E字标，观察出大的凸起的E字标开口方向，按键盘的上下左右键选择开口方向，或者点击屏幕上的方向按钮。",
        selectGlasses: true,//是否需要选择眼镜
        selectLazyEye: false,//是否需要选择差眼，如果该项为true，则必须让selectGlasses也为true，因为需要眼镜信息来计算目标的正确颜色。脱抑制用。
        selectDifficulty: false,//是否需要选择难度
        staticPath: "../../static/",//该训练的html相对于static文件夹的路径
        callback: (trainInfor)=>{// 完成选择后的回调函数，将开始训练放在其中，trainInfor是患者选择的结果
            //trainInfor.glasses为"rb"或"br"
            //trainInfor.difficulty为难度easy hard medium
            //targetInfor里面有color和filter，是脱抑制的目标颜色信息。打印看看
            console.log(trainInfor);
            window.trainInfor = trainInfor
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
            this.directionIndex = babyEye.randomRange(0,4);
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
                {id: "mBG", src: "../../static/music/bg/s21.mp3"},
                {id: "wonderful", src: "../../static/music/wonderful.mp3"},

                {id: "e-up", src: "../src/ste-identify-direction/img/e-up.png"},
                {id: "e-down", src: "../src/ste-identify-direction/img/e-down.png"},
                {id: "e-right", src: "../src/ste-identify-direction/img/e-right.png"},
                {id: "e-left", src: "../src/ste-identify-direction/img/e-left.png"},

                {id: "up", src: "../src/ste-identify-direction/img/up.png"},
                {id: "down", src: "../src/ste-identify-direction/img/down.png"},
                {id: "right", src: "../src/ste-identify-direction/img/right.png"},
                {id: "left", src: "../src/ste-identify-direction/img/left.png"},

                {id: "bg", src: "../src/ste-identify-direction/img/bg.png"},
                {id: "level", src: "../src/ste-identify-direction/img/level.png"},
                {id: "preface", src: "../src/ste-identify-direction/img/preface.png"},

                {id: "start-red", src: "../src/ste-identify-direction/img/start-red.png"},
                {id: "start-green", src: "../src/ste-identify-direction/img/start-green.png"}
            ];

            //加载
            gameResource.loadManifest(loadArr);
        }

        onLoadingComplete(){
            this.stage.removeAllChildren();
            this.buildLevel();
            this.buildWorld();//产生训练场景
            this.buildButtons();//产生训练按钮
            this.render();
            createjs.Sound.play("mBG", createjs.Sound.INTERRUPT_NONE,0,0,-1,0.5,0);
        }


        buildWorld(){
            if(this.world) this.stage.removeChild(this.world);
            this.world = new World(this);
            this.stage.addChildAt(this.world,0);
        }

        buildLevel(){
            this.level = new babyEye.Level(0,0);
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
            createjs.Sound.play("wonderful", createjs.Sound.INTERRUPT_NONE,0,0,0,1,0);
            this.stage.addChild(babyEye.successBitmap);
            babyEye.successBitmap.visible = true;
            setTimeout(()=>{
                babyEye.successBitmap.visible = false;
            },1500);
            this.level.changeValue(1)
            this.updateLevel()
        }

        fail(){
            this.stage.addChild(babyEye.failBitmap);
            setTimeout(()=>{
                this.stage.removeChild(babyEye.failBitmap);
            },1000);
            this.level.changeValue(-1)
            this.updateLevel()
        }

        updateLevel(){
            this.buildWorld();
        }

        replay(){
            $(window).unbind();//解绑事件
            this.stage.removeAllChildren();
            this.stage.removeAllEventListeners();
            this.pause();
            createjs.Sound.stop();
            babyEye.prepareTrain(prepareConfig);
        }
    }


    class World extends createjs.Container {
        constructor(game) {
            super();
            this.game = game;
            this.lastFrame = 0;
            this.runningTime = 0;
            this.deltaX = 30 - this.game.level.value;
            if(this.deltaX < 6) this.deltaX = 6;
            this.buildBG();
            this.buildEs();
            this.buildButtons();
            this.events();
        }

        buildBG() {
            this.bg = new createjs.Bitmap(gameResource.getResult("bg"));
            this.addChild(this.bg);
        }

        buildButtons(){
            this.buttons = new DirectionButton((direction)=>{
                this.judge(direction);
            });
            this.addChild(this.buttons);
            this.buttons.set({
                x: this.game.width - 200,
                y: this.game.height - 350,
                scaleX: 1.5,
                scaleY: 1.5,
                compositeOperation: "source-over"
            })
        }

        buildEs(){
            this.eContainer = new createjs.Container();
            this.eContainer.compositeOperation = 'darken'
            let images = [];
            let directions = "up,down,left,right".split(",");
            directions.forEach((direction)=>{
                images.push(gameResource.getResult("e-"+direction));
            });

            this.game.directionIndex = babyEye.randomExcept(0,4, this.game.directionIndex);

            this.direction = directions[this.game.directionIndex]//凸起方向

            let map = window.directionMap[this.direction];
            let convexBitmaps = images.map((image)=>{
                return new E(image, this.deltaX, "convex");
            })

            let sunkenBitmaps = images.map((image)=>{
                return new E(image, this.deltaX, "sunken");
            })

            for(let row = 0; row < 5; row++) {
                for(let col = 0; col < 5; col++) {
                    let e;
                    if(map[row][col]) {
                        e = convexBitmaps[babyEye.randomRange(0,4)].clone(true);
                    }else {
                        e = sunkenBitmaps[babyEye.randomRange(0,4)].clone(true);
                    }

                    e.set({
                        x: col * 150,
                        y: row * 150
                    });

                    this.eContainer.addChild(e);
                }
            }

            this.eContainer.set({
                x: this.game.width/2 - 100,
                y: this.game.height/2,
                regX: 710/2,
                regY: 700/2,
                scaleX: 0.6,
                scaleY: 0.6
            });

            this.addChild(this.eContainer);
        }

        events() {
            let keyMap = {
                "37": "left",
                "38": "up",
                "39": "right",
                "40": "down"
            }
            $(window).unbind("keydown");
            $(window).bind("keydown", (ev)=>{
                if(ev.keyCode >= 37 && ev.keyCode <= 40) {
                    this.judge(keyMap[ev.keyCode]);
                }
            })
        }

        judge(direction) {
            if(direction == this.direction) {
                this.game.succeed();
            }else {
                this.game.fail();
            }
        }

        update(deltaTime) {
            this.runningTime+=deltaTime;
        }
    }

    class E extends createjs.Container {
        constructor(image, delta, type) {
            super();
            let leftImg, rightImg;
            if(type == "convex"){
                leftImg = new babyEye.FilteredImg(image, [trainInfor.glasses=='br'?babyEye.blueFilter: babyEye.redFilter]);
                rightImg = new babyEye.FilteredImg(image, [trainInfor.glasses=='br'?babyEye.redFilter: babyEye.blueFilter]);
            }else if(type == "sunken") {
                leftImg = new babyEye.FilteredImg(image, [babyEye.redFilter]);
                rightImg = new babyEye.FilteredImg(image, [babyEye.blueFilter]);
                delta=0;
            }

            let bitmapLeft = new createjs.Bitmap(leftImg);
            let bitmapRight = new createjs.Bitmap(rightImg);

            bitmapLeft.x = -delta/2;
            bitmapRight.x = delta/2;

            this.addChild(bitmapLeft, bitmapRight);
        }
    }

    class DirectionButton extends createjs.Container{
        constructor(callback){
            super();
            this.callback = callback;
            this.buildContent();
        }

        buildContent(){
            let directions = "up,left,down,right".split(",")
            directions.forEach((direction, index)=>{
                let button = new createjs.Bitmap(gameResource.getResult(direction));
                this.addChild(button);
                button.addEventListener("mousedown", ()=>{
                    this.callback(direction);
                });
                this[direction + "Button"] = button;
            });

            this.upButton.set({
                x: 0,
                y: -48,
            })

            this.downButton.set({
                x: 0,
                y: 48,
            })

            this.leftButton.set({
                x: -48,
                y: 0,
            })

            this.rightButton.set({
                x: 48,
                y: 0,
            })
        }
    }
})