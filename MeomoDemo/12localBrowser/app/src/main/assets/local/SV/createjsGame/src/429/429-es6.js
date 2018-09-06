$(window).ready(function () {
    let prepareConfig = {
        selectGlasses: true,//是否需要选择眼镜
        // selectFuseType: true,//是否有融合模式选择
        //以上属性，均为可选，没有该属性默认false或其他默认值！！！！！！！！！！
        instruction: "请用鼠标或者手指把红色的十字图形移动到蓝色的交叉图形的最中间位置，点击一下即可，移动端通过滑动控制十字图形，抬起手指即为确定。",
        staticPath: "../../../static/",//该训练的html相对于static文件夹的路径
        // background: "pink-grid",
        callback: (trainInfor)=>{// 完成选择后的回调函数，将开始训练放在其中，trainInfor是患者选择的结果
            //trainInfor.glasses为"rb"|"br"
            window.filters = [babyEye.redFilter, babyEye.blueFilter]
            if(trainInfor.glasses == 'rb'){
                window.filters.reverse()
            }
            //trainInfor.difficulty为难度"easy"|"hard"|"medium"
            //trainInfor.twinkleType为闪烁模式 "altermate"|"lazy"|"same"
            //trainInfor.fuseType为融合模式 "center"|"round"|"entire"
            //trainInfor.vergenceType的结果是"convergence"|"divergence"，对应集合和散开
            //trainInfor.convergenceDelta 是集合时，左右相差的最大距离，单位是像素
            //trainInfor.divergenceDelta 是散开时，左右相差的最大距离，单位是像素
            //targetInfor里面有color和filter，是脱抑制的目标颜色信息。打印看看
            console.log(trainInfor);
            init(trainInfor);//选择完成后，开始训练函数
        }
    }

    babyEye.prepareTrain(prepareConfig);//选择训练参数和说明展示

    //begin for develop--------------------------------
    // let prepareConfig = {
    //     staticPath: "../../static/",//该训练的html相对于static文件夹的路径
    //     callback: () => {
    //         let trainInfor = {
    //             glasses: "rb",
    //             difficulty: "easy",
    //             targetInfor: { color: "red", filter: new createjs.ColorFilter(1, 0, 0, 1, 255, 0, 0, 0) },
    //             fuseType: "entire",
    //             vergenceType: "convergence",
    //             twinkleType: "lazy",
    //             convergenceDelta: 20,
    //             divergenceDelta: 20,
    //         }
    //         init(trainInfor);//选择完成后，开始训练函数
    //     }
    // }

    // babyEye.prepareTrain(prepareConfig);
    //end for develop------------------------------------

    //开始训练函数
    function init(trainInfor) {
        window.game = new Game(trainInfor);
        window.log = console.log;
    }
    //声明训练资源
    let gameResource = null;

    class Game {
        constructor(trainInfor) {
            this.trainInfor = trainInfor;
            this.stage = new createjs.Stage("game-canvas");
            this.stage.enableMouseOver();
            this.stage.cursor = "none"
            createjs.Touch.enable(this.stage);
            this.width = this.stage.canvas.width;
            this.height = this.stage.canvas.height;
            this.lastFrame = 0;
            if (gameResource) {//如果已加载，不再重复加载
                this.onLoadingComplete();
            } else {
                this.loadResource();
            }
        }

        loadResource() {
            $("#loading").show();
            //训练资源第一次，唯一一次赋值
            gameResource = new createjs.LoadQueue();
            //加载并发
            gameResource.setMaxConnections(100);
            // 关键！---一定要将其设置为 true, 否则不起作用。  
            gameResource.maintainScriptOrder = true;
            gameResource.installPlugin(createjs.Sound);

            //添加加载事件
            gameResource.addEventListener("complete", (ev) => {
                $("#loading").hide();
                $("body").addClass("pink-bg");
                this.onLoadingComplete();
            });
            //加载资源路径
            let loadArr = [];
            loadArr.push(
                {id: "wonderful", src: "../../../static/music/wonderful.mp3"},
                {id: "click", src: "../../../static/music/click.mp3"},
                {id: "mBG", src: "../../../static/music/3.mp3"},
                {id: "gun", src: "../src/429/gun.png"},
                {id: "target", src: "../src/429/target.png"},
                {id: "bg", src:"../src/429/gratings.png"}
            )

            //加载
            gameResource.loadManifest(loadArr);
        }

        onLoadingComplete() {
            this.beginTrain();
        }

        beginTrain(){
            this.stage.removeAllChildren();
            this.buildWorld();//产生训练场景
            this.buildButtons();//产生训练按钮
            this.buildLevel();//产生得分类
            this.buildBG()
            this.render();
            createjs.Sound.play("mBG", createjs.Sound.INTERRUPT_NONE,0,0,-1,0.5,0); 
        }

        buildBG(){
            this.bg = new createjs.Shape()
            this.bg.graphics.f('#ff00ff').dr(0,0,this.width,this.height)
            this.stage.addChildAt(this.bg,0)
        }

        buildWorld() {
            this.world = new World(this);
            this.stage.addChildAt(this.world, 0);
        }

        buildButtons() {
            //参数为重新开始函数，返回类型bitmap
            this.replayButton = new babyEye.ReplayButton(() => {
                this.replay();
            });
            this.helpButton = new babyEye.HelpButton(prepareConfig);//接受prepareConfig，返回类型bitmap

            this.stage.addChild(this.replayButton, this.helpButton);
        }

        buildLevel() {
            this.level = new babyEye.Level(1,1);//还有当前关数类，是babyEye.Level,用法完全一样，只是背景文字不同。
            // this.level.view.x -= 210;
            this.stage.addChild(this.level.view);
        }

        buildCountDown(){
            if(this.countDown) this.stage.removeChild(this.countDown.view);
            let config = {
                duration: 300 * 1000,//倒计时时间
                callback: ()=>{//倒计时为0时候的回调函数
                    this.end();
                }
            };

            this.countDown = new babyEye.CountDown(config);
            this.stage.addChild(this.countDown.view);
        }

        render(timestamp = 0) {
            if (this.pauseValue) return;
            if (this.endValue) return;


            let dt = timestamp - this.lastFrame;
            if (dt > 150 || dt < 0) dt = 0;
            this.lastFrame = timestamp;

            // this.world.update(dt);
            this.stage.update();

            requestAnimationFrame((timestamp) => {
                this.render(timestamp);
            })
        }

        pause() {
            this.pauseValue = true;
        }

        continue() {
            if (this.pauseValue) {
                this.pauseValue = false;
                this.render();
            }
        }

        succeed() {
            this.stage.addChild(babyEye.successBitmap)
            setTimeout(()=>{
                this.stage.removeChild(babyEye.successBitmap)
            }, 1000)
            this.level.changeValue(1);
            createjs.Sound.play("wonderful", createjs.Sound.INTERRUPT_NONE,0,0,0,1,0);
        }

        fail() {
            this.level.changeValue(-1)
            createjs.Sound.play("click", createjs.Sound.INTERRUPT_NONE,0,0,0,1,0);
        }

        replay() {
            $(window).unbind();//解绑事件
            this.stage.removeAllChildren();
            this.stage.removeAllEventListeners();
            this.stage.enableMouseOver(0);
            this.pause();
            createjs.Sound.stop();
            babyEye.prepareTrain(prepareConfig);
        }
    }

    class World extends createjs.Container {
        constructor(game) {
            super()
            this.game = game;
            this.runningTime = 0;

            this.bgObj = new BG(this.game);
            this.gun = new Gun(this.game);
            this.target = new Target(this.game);

            this.addChild(this.bgObj,this.target,this.gun);
            this.addEvents();
        }

        addEvents() {
            this.game.stage.removeAllEventListeners();
            let oldPt = {x:0,y:0};
            let oldGun = {x:0, y:0};
            let mousedown = false;
            this.game.stage.addEventListener("stagemousemove", (ev)=>{
                if(!mousedown) {
                    this.gun.x = this.game.stage.mouseX;
                    this.gun.y = this.game.stage.mouseY;
                }
            })

            this.game.stage.addEventListener("stagemouseup",(ev)=>{
                mousedown = false;
                createjs.Sound.play("click", createjs.Sound.INTERRUPT_NONE,0,0,0,.5,0);
                let distance = babyEye.distance(this.gun.x, this.gun.y, this.target.x,this.target.y);
                this.judge(distance);
            })

            this.game.stage.addEventListener("stagemousedown", (ev)=>{
                mousedown = true;
                [oldPt.x, oldPt.y] = [ev.stageX, ev.stageY];
                [oldGun.x, oldGun.y] = [this.gun.x, this.gun.y];
            })

            this.game.stage.addEventListener("pressmove", (ev)=>{
                this.gun.x = oldGun.x + ev.stageX - oldPt.x;
                this.gun.y = oldGun.y + ev.stageY - oldPt.y;

            })
        }

        judge(distance) {
            let thresholed = 9;
            if(this.game.level.value > 2) {
                thresholed = 8;
            }
            if(this.game.level.value > 4) {
                thresholed = 7;
            }

            if(this.game.level.value > 6) {
                thresholed = 6;
            }

            if(this.game.level.value > 8) {
                thresholed = 5;
            }

            if(distance < thresholed){
                this.game.succeed();
            } else {
                this.game.fail();
            }

            this.updateObjects();
        }

        updateObjects() {
            this.target.set({
                x: babyEye.randomRange(250,this.game.width-250),
                y: babyEye.randomRange(250, this.game.height-250),
                scaleX: this.game.level.value < 5 ?(11 - this.game.level.value)/10 : 0.5,
                scaleY: this.game.level.value < 5 ?(11 - this.game.level.value)/10 : 0.5
            })

            this.gun.set({
                scaleX: this.game.level.value < 5 ?(11 - this.game.level.value)/10 : 0.5,
                scaleY: this.game.level.value < 5 ?(11 - this.game.level.value)/10 : 0.5
            })
        }
    }

    class BG extends c.Container {
        constructor(game) {
            super();
            // new babyEye.babyEye.ImageFiltered(originalImg, [this.game.trainInfor.targetInfor.filter])
            this.game = game;
            let originalImg = gameResource.getResult("bg");
            let spriteObj = {
                "images": [new babyEye.ImageFiltered(originalImg, [new createjs.ColorFilter(1,0,1,1,0,0,0)])],
                "frames": [
                    [91, 358, 87, 87], 
                    [91, 269, 87, 87], 
                    [2, 358, 87, 87], 
                    [2, 269, 87, 87], 
                    [91, 180, 87, 87], 
                    [2, 180, 87, 87], 
                    [91, 91, 87, 87], 
                    [2, 91, 87, 87], 
                    [91, 2, 87, 87], 
                    [2, 2, 87, 87]
                ],
                "animations": {
                    run: [0,9,"run",0.5],
                }
            }


            let spriteSheet = new c.SpriteSheet(spriteObj);
            let sprite = new c.Sprite(spriteSheet,"run");
            this.blueCircle = new c.Shape(new c.Graphics().beginFill("rgb(128,0,255)").drawCircle(43,44,39));
            this.redCircle = new c.Shape(new c.Graphics().beginFill("rgb(255,0,128)").drawCircle(43,44,39));
            this.addChild(this.blueCircle, this.redCircle, sprite);

            let bounds = this.getBounds();
            this.set({
                x: this.game.width/2,
                y: this.game.height/2,
                regX: bounds.width/2,
                regY: bounds.height/2,
                scaleX: 10,
                scaleY: 8
            })

            this.changeDirection();
            this.changeColor();
        }
        changeDirection() {
            this.scaleX *= -1;
            setTimeout(()=>{
                this.changeDirection();
            }, 3000);
        }

        changeColor() {
            this.redCircle.visible = !this.redCircle.visible;
            setTimeout(()=>{
                this.changeColor();
            }, 6000);
        }
    }

    class Gun extends c.Container {
        constructor(game) {
            super();
            this.game = game;
            this.addGun();
            let bounds ={x:0,y:0,width:67.89, height: 67.89};
            this.set({
                x: babyEye.randomRange(bounds.width/2,this.game.width-bounds.width/2),
                y: babyEye.randomRange(bounds.height/2,this.game.height-bounds.height/2),
                regX: bounds.width/2,
                regY: bounds.height/2
            })

            this.flicker();
            this.compositeOperation = "darken";
        }

        addGun() {
            let originalImg = new babyEye.ImageFiltered(gameResource.getResult("gun"), [window.filters[1]]);
            let gun = new createjs.Bitmap(originalImg);
            gun.set({
                scaleX: 0.7,
                scaleY: 0.7
            })
            this.addChild(gun);
        }

        flicker() {
            this.visible = !this.visible;
            setTimeout(()=>{
                this.flicker();
            }, 100);
        }
    }

    class Target extends c.Container {
        constructor(game) {
            super();
            this.game = game;
            this.addTarget();
            this.flicker();
        }

        addTarget(){
            let originalImg = gameResource.getResult("target");
            let filteredImg = new babyEye.ImageFiltered(gameResource.getResult("target"), [window.filters[0]]);

            let targetCross = new createjs.Bitmap(filteredImg);
            targetCross.set({
                regX: originalImg.width/2,
                regY: originalImg.height/2,
                x:0,
                y:0,
                scaleX: 0.6,
                scaleY: 0.6,
            })

            this.addChild(targetCross);
            this.compositeOperation = "darken";

            this.set({
                x: babyEye.randomRange(originalImg.width/2,this.game.width-originalImg.width/2),
                y: babyEye.randomRange(originalImg.height/2,this.game.height-originalImg.height/2),
            });
        }

        flicker() {
            this.visible = !this.visible;
            setTimeout(()=>{
                this.flicker();
            }, 100);
        }
    }
})