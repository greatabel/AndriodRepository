$(window).ready(function () {
    let prepareConfig = {
        selectGlasses: true,//是否需要选择眼镜
        // selectFuseType: true,//是否有融合模式选择
        testForFU: true,//是否进行融合测试，选择该项，必须选择眼镜
        selectDifficulty: true,//是否需要选择难度
        //以上属性，均为可选，没有该属性默认false或其他默认值！！！！！！！！！！
        instruction: "本训练为融合训练，训练前会测量你的融合能力。场景中有四处游动的小鱼，用鼠标控制圆网，套住小鱼后点击一下确定捕捉，每捕到一只鱼加一分。（移动设备可以手指滑动屏幕控制圆网，抬起手指为确定捕捉）家长可协助操作。",
        staticPath: "../../static/",//该训练的html相对于static文件夹的路径
        background: "pink-grid",
        callback: (trainInfor)=>{// 完成选择后的回调函数，将开始训练放在其中，trainInfor是患者选择的结果
            //trainInfor.glasses为"rb"|"br"
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
                // $("body").addClass("pink-bg");
                this.onLoadingComplete();
            });
            //加载资源路径
            let loadArr = [
                { id: "click", src: "../../static/music/click/1.mp3"},
                { id: "wonderful", src: "../../static/music/wonderful.mp3"},
                { id: "mBG", src: "../../static/music/bg/s12.mp3"},
            ];
            loadArr.push(
                {id: "fish",src: "../src2/fu-catch-fish/img/fish.png"},
                {id: "bg",src: "../src2/fu-catch-fish/img/bg.png"},
                {id: "intro-end", src: "../src2/fu-catch-fish/img/intro-end.png"},
                {id: "intro-end-next", src: "../src2/fu-catch-fish/img/intro-end-next.png"},
                {id: "result-end", src: "../src2/fu-catch-fish/img/result-end.png"},
                {id: "result-end1", src: "../src2/fu-catch-fish/img/result-end1.png"},
                {id: "replay", src: "../src2/fu-catch-fish/img/replay.png"}
            )

            //加载
            gameResource.loadManifest(loadArr);
        }

        onLoadingComplete() {
            this.beginIntroduction();
        }

        beginIntroduction(){
            let pages = [];
            let pagesID = ["inrto-end"];

            let introEnd = new createjs.Bitmap(gameResource.getResult("intro-end"));
            let introEndNext = new babyEye.Button("intro-end-next", gameResource, ()=>{
                this.stage.removeAllChildren();
                this.beginTrain();
            })
            introEndNext.set({x: 1100,y:650})
            this.stage.addChild(introEnd,introEndNext)
            this.stage.update();
        }

        beginTrain(){
            this.stage.removeAllChildren();
            this.buildWorld();//产生训练场景
            this.buildBG();
            this.buildButtons();//产生训练按钮
            this.buildScore();//产生得分类
            this.buildCountDown();
            this.render();
            createjs.Sound.play("mBG", createjs.Sound.INTERRUPT_NONE,0,0,-1,0.5,0); 
        }

        buildWorld() {
            this.world = new World(this);
            this.stage.addChildAt(this.world.view, 0);
        }

        buildBG(){
            let bg = new createjs.Bitmap(gameResource.getResult("bg"));
            this.stage.addChild(bg);
        }

        buildButtons() {
            //参数为重新开始函数，返回类型bitmap
            this.replayButton = new babyEye.ReplayButton(() => {
                this.replay();
            });
            this.helpButton = new babyEye.HelpButton(prepareConfig);//接受prepareConfig，返回类型bitmap

            this.stage.addChild(this.replayButton, this.helpButton);
        }

        buildScore() {
            this.score = new babyEye.Score(0,0);//还有当前关数类，是babyEye.Level,用法完全一样，只是背景文字不同。
            this.score.view.x -= 210;
            this.stage.addChild(this.score.view);
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

            this.world.update(dt);
            this.countDown.update(dt);
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
            // this.stage.addChild(babyEye.successBitmap);
            // setTimeout(()=>{
            //     this.stage.removeChild(babyEye.successBitmap);
            // }, 1000)
            this.score.changeValue(1);
            createjs.Sound.play("wonderful", createjs.Sound.INTERRUPT_NONE,0,0,0,1,0);
        }

        fail() {
            createjs.Sound.play("click", createjs.Sound.INTERRUPT_NONE,0,0,0,1,0);
        }

        end(){
            this.stage.removeAllChildren();
            this.endValue = true;
            let endPage = new createjs.Bitmap(gameResource.getResult(this.score.value > 10? "result-end":"result-end1"));
            let replay = new babyEye.Button("replay", gameResource, ()=>{
                this.replay();
            })
            replay.set({x: 610,y: 660});
            let resultScore = new createjs.Text(this.score.value, "30px cursive", "black");
            window.resultScore = resultScore;
            resultScore.set({x: 738,y: 165, textAlign: "center", textBaseline: "middle"})
            if(this.score.value > 10) resultScore.set({x:710,y:175});

            this.stage.addChild(endPage, replay, resultScore);
            this.stage.update();
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

    class World {
        constructor(game) {
            this.game = game;
            this.runningTime = 0;
            this.netLocation = new babyEye.Vec2(100,200);
            this.fish = [];
            this.buildView();
            this.buildBG();
            this.buildFish();
            this.buildNet();
            this.events();
        }

        buildBG(){
            let bg = new createjs.Shape();
            bg.graphics.f("#ff00ff").dr(0,200,this.game.width,this.game.height)
            this.view.addChild(bg);

            let line = new createjs.Shape();
            line.graphics.f("white").dr(0,0,100,10);
            line.y = 200;
            line.x = 500;
            this.view.addChild(line);
        }


        update(dt) {
            this.runningTime += dt;
            this.net.update(dt);
            
            for(let i = 0; i < this.fish.length; i++){
                this.fish[i].flee(this.net.location, 150);
                for(let j = 0; j < this.fish.length; j++){
                    if(i!=j){
                        this.fish[i].flee(this.fish[j].location, 50);
                    }
                }
            }

            this.fish.forEach((f)=>{
                f.update(dt);
            });
        }

        events(){
            if(babyEye.isMobile()){
                let mouseDownLocation, dir = new babyEye.Vec2(), netDownLocation;
                this.view.addEventListener("mousedown",(ev)=>{
                    mouseDownLocation = new babyEye.Vec2(ev.localX,ev.localY);
                    netDownLocation = this.net.location.get();
                })

                this.game.stage.addEventListener("pressmove",(ev)=>{
                    dir.set(ev.localX, ev.localY);
                    dir.sub(mouseDownLocation);
                    dir.add(netDownLocation);
                    dir.x = Math.max(0,dir.x);
                    dir.x = Math.min(dir.x,1280);
                    dir.y = Math.max(200,dir.y);
                    dir.y = Math.min(dir.y,720);
                    this.net.setLocation(dir.x, dir.y);
                })

                this.view.addEventListener("pressup",(ev)=>{
                    this.judge();
                })

            } else {
                this.game.stage.addEventListener("stagemousemove",(ev)=>{
                    this.net.setLocation(ev.localX,ev.localY);
                })

                this.view.addEventListener("mousedown",(ev)=>{
                    this.judge();
                })

            }
        }

        judge(){
            let catched = false;
            this.fish.forEach((fish)=>{
                if(babyEye.Vec2.distance(fish.location,this.net.location) < 30){
                    fish.reborn();
                    catched = true;
                }
            })

            if(!catched) this.game.fail();
        }

        buildView(){
            this.view = new createjs.Container();
            this.view.cursor = "none";
        }

        buildNet(){
            this.net = new Net({world: this});
            this.view.addChild(this.net.view);
        }

        buildFish(){
            for(let i = 0; i < 6; i++){
                let currentFish = new Fish({
                    world: this,
                    location: new babyEye.Vec2(babyEye.randomRange(0,this.game.width),babyEye.randomRange(0,this.game.height)),
                    acceleration: new babyEye.Vec2(0,0),
                    velocity: new babyEye.Vec2(Math.random(), Math.random())
                });
                this.view.addChild(currentFish.view);
                this.fish.push(currentFish);
            }
        }
    }

    class Net {
        constructor(config){
            this.world = config.world;
            this.game = this.world.game;
            this.convergenceDelta = this.game.trainInfor.convergenceDelta;
            this.divergenceDelta = this.game.trainInfor.divergenceDelta;
            this.halfConver = this.convergenceDelta/2;
            this.halfDiver = this.divergenceDelta/2;
            this.glasses = this.game.trainInfor.glasses;
            this.vergenceSpeed = 0.01;
            this.location = new babyEye.Vec2(this.game.width/2, this.game.height/2);
            this.buildView();
        }

        buildView(){
            this.view = new createjs.Container();
            this.subView0 = new createjs.Shape();
            this.subView1 = new createjs.Shape();
            this.subView0.graphics.ss(10).s("red").dc(0,0,50);
            this.subView1.graphics.ss(10).s("blue").dc(0,0,50);
            if(this.glasses == "rb") {
                [this.subView0, this.subView1] = [this.subView1, this.subView0];
            }
            this.view.addChild(this.subView0, this.subView1);
            this.view.compositeOperation = "darken";
        }

        update(dt){
            this.view.x = this.location.x;
            this.view.y = this.location.y;

            if(this.subView0.x > this.halfConver){
                this.subView0.x = this.halfConver;
                this.subView1.x = -this.halfConver;
                this.vergenceSpeed *= -1;
            }
            if(this.subView1.x > this.halfDiver) {
                this.subView1.x = this.halfDiver;
                this.subView0.x = -this.halfDiver;
                this.vergenceSpeed *= -1;
            }

            this.subView0.x += this.vergenceSpeed * dt;
            this.subView1.x -= this.vergenceSpeed * dt;
        }

        setLocation(x,y){
            this.location.set(x,y)
        }
    }

    class Fish{
        constructor(config){
            this.world = config.world;
            this.game = this.world.game;
            this.location = config.location;
            this.velocity = config.velocity;
            this.acceleration = config.acceleration;
            let vArr = {"easy": 0.06, "medium": 0.12, "hard": 0.18}
            this.maxSpeed = vArr[this.game.trainInfor.difficulty];
            this.maxForce = 0.05;
            this.r = 20;
            this.buildView();
            this.buildSpace();
        }

        update(dt){
            this.velocity.add(this.acceleration);
            // this.velocity.limit(this.maxSpeed);
            this.velocity.normalize();
            this.velocity.mult(this.maxSpeed);
            this.location.add(babyEye.Vec2.mult(this.velocity,dt));
            this.clearForce();
            this.bounds();
            this.updateView();
        }

        updateView(){
            this.view.set({
                x: this.location.x,
                y: this.location.y,
                rotation: this.velocity.heading()
            });
        }

        buildView(){
            this.view = new createjs.Bitmap(gameResource.getResult("fish"));
            this.view.set({
                regX: this.view.image.width/2,
                regY: this.view.image.height/2
            })
        }

        buildSpace(){
            this.space = {
                lowerX: -this.r,
                lowerY: 200 -this.r,
                higherX: this.game.width + this.r,
                higherY: this.game.height + this.r
            }
        }

        seek(target){
            let dir = babyEye.Vec2.sub(target,this.location);
            if(dir.mag() < 30) {
                this.velocity.limit(babyEye.map(dir.mag(),0,100,0,this.maxSpeed));
                return;
            };
            dir.normalize();
            dir.mult(this.maxForce);
            this.applyForce(dir);
        }

        flee(target, scope=100){
            let dir = babyEye.Vec2.sub(this.location,target);
            let distance = dir.mag();
            if(distance > scope) {
                return;
            };
            dir.normalize();
            dir.mult(this.maxForce);
            this.applyForce(dir);
        }

        applyForce(f){
            this.acceleration.add(f);
        }

        clearForce(){
            this.acceleration.x = 0;
            this.acceleration.y = 0;
        }

        bounds(){
            if(this.location.x < this.space.lowerX) this.location.x = this.space.higherX;
            if(this.location.y < this.space.lowerY) this.location.y = this.space.higherY;
            if(this.location.x > this.space.higherX) this.location.x = this.space.lowerX;
            if(this.location.y > this.space.higherY) this.location.y = this.space.lowerY;
        }

        reborn(){
            babyEye.randomChoice = (arr)=>{
                return arr[babyEye.randomRange(0, arr.length)];
            }
            this.game.succeed();
            this.location = new babyEye.Vec2(
                babyEye.randomChoice([this.space.lowerX,this.space.higherX]),
                babyEye.randomChoice([this.space.lowerY, this.space.higherY])
            )
        }
    }
})