$(window).ready(function(){
    let prepareConfig = {
        instruction: "本训练为同时视训练，场景中有一颗苹果树，下方有一个接苹果的篮子，在苹果下落到篮子里的时候，点击一下空格键（触屏设备点击训练任意位置）。如果在点击时，篮子接住了苹果则加分，否则减分。看看你能得多少分吧！",
        selectGlasses: true,//是否需要选择眼镜
        selectLazyEye: false,//是否需要选择差眼，如果该项为true，则必须让selectGlasses也为true，因为需要眼镜信息来计算目标的正确颜色。脱抑制用。
        selectTwinkleType: false,//是否有闪烁模式选择
        staticPath: "../../../static/",//该训练的html相对于static文件夹的路径
        callback: (trainInfor)=>{// 完成选择后的回调函数，将开始训练放在其中，trainInfor是患者选择的结果
            //trainInfor.glasses为"rb"|"br"
            //trainInfor.difficulty为难度"easy"|"hard"|"medium"
            //trainInfor.twinkleType为闪烁模式 "altermate"|"lazy"|"same"
            //trainInfor.fuseType为融合模式 "center"|"round"|"entire"
            //targetInfor里面有color和filter，是脱抑制的目标颜色信息。打印看看
            //console.log(trainInfor)
            init(trainInfor)//选择完成后，开始训练函数
        }
    }

    babyEye.prepareTrain(prepareConfig)//选择训练参数和说明展示

    //begin for develop--------------------------------
    // let prepareConfig = {
    //     staticPath: "../../../static/",//该训练的html相对于static文件夹的路径
    //     callback: ()=>{
    //         let trainInfor = {
    //             glasses:"br",
    //             difficulty: "easy",
    //             twinkleType: "altermate",
    //             fuseType: "center",
    //             targetInfor:{color: "red", filter: new createjs.ColorFilter(1,0,0,1,255,0,0,0)}
    //         }
    //         init(trainInfor)//选择完成后，开始训练函数
    //     }
    // }

    // babyEye.prepareTrain(prepareConfig)
    // let log = console.log.bind(console)
    //end for develop------------------------------------

    //开始训练函数
    function init(trainInfor){
        window.game = new Game(trainInfor)
    }
    //声明训练资源
    let gameResource = null


    class Game {
        constructor(trainInfor){
            this.trainInfor = trainInfor
            this.stage = new createjs.Stage("game-canvas")
            this.stage.enableMouseOver()
            createjs.Touch.enable(this.stage)
            this.width = this.stage.canvas.width
            this.height = this.stage.canvas.height
            this.lastFrame = 0
            if(gameResource){//如果已加载，不再重复加载
                this.onLoadingComplete()
            } else {
                this.loadResource()
            }
        }

        loadResource(){
            $("#loading").show()
            gameResource = new createjs.LoadQueue()
            gameResource.setMaxConnections(100)
            gameResource.maintainScriptOrder=true  
            gameResource.installPlugin(createjs.Sound)
            gameResource.addEventListener("complete", (ev)=>{
                $("#loading").hide()
                $("body").addClass("pink-bg")
                this.onLoadingComplete()
            })

            let loadArr = [
                {id: "tree", src: "../src2/sv-catch-apple/img/tree.png"},
                {id: "apple", src: "../src2/sv-catch-apple/img/apple.png"},
                {id: "bucket", src: "../src2/sv-catch-apple/img/bucket.png"}
            ]

            loadArr = loadArr.concat([
                {id: "wonderful", src: "../../../static/music/wonderful.mp3"},
                {id: "wrong", src: "../../../static/music/collision/1.mp3"},
                {id: "mBG", src: "../../../static/music/bg/s19.mp3"},
            ])
            gameResource.loadManifest(loadArr)
        }

        onLoadingComplete(){
            this.stage.removeAllChildren()
            this.buildWorld()//产生训练场景
            this.buildButtons()//产生训练按钮
            this.buildScore()//产生得分类
            this.render()
            createjs.Sound.play("mBG", createjs.Sound.INTERRUPT_NONE,0,0,-1,0.5,0)
        }

        buildWorld(){
            this.world = new World(this)
            this.stage.addChildAt(this.world.view)
        }

        buildButtons(){
            //参数为重新开始函数，返回类型bitmap
            this.replayButton = new babyEye.ReplayButton(()=>{
                this.replay()
            })
            this.helpButton = new babyEye.HelpButton(prepareConfig)//接受prepareConfig，返回类型bitmap
            this.stage.addChild(this.replayButton, this.helpButton)
        }

        buildScore(){
            this.score = new babyEye.Score()//还有当前关数类，是babyEye.Level,用法完全一样，只是背景文字不同。
            this.stage.addChild(this.score.view)
        }

        render(timestamp = 0){
            if(this.pauseValue) return
            if(this.failValue) return

            let dt = timestamp - this.lastFrame
            if(dt > 150 || dt < 0) dt = 0
            this.lastFrame = timestamp
            
            this.world.update(dt)
            this.stage.update()

            requestAnimationFrame((timestamp)=>{
                this.render(timestamp)
            })
        }

        pause(){
            this.pauseValue = true
        }

        continue(){
            if(this.pauseValue){
                this.pauseValue = false
                this.render()
            }
        }

        succeed(){
            this.stage.addChild(babyEye.successBitmap)
            setTimeout(()=>{
                this.stage.removeChild(babyEye.successBitmap)
            },1000)
        }

        fail(){
            // this.failValue = true
            this.stage.addChild(babyEye.failBitmap)
            setTimeout(()=>{
                this.stage.removeChild(babyEye.failBitmap)
            },1000)
        }

        replay(){
            $(window).unbind()//解绑事件
            this.stage.removeAllChildren()
            this.stage.removeAllEventListeners()
            createjs.Sound.stop()
            this.pause()
            babyEye.prepareTrain(prepareConfig)
        }
    }

    class World {
        constructor(game){
            this.game = game
            this.trainInfor = this.game.trainInfor
            this.toRemove = []
            this.apples = []
            this.g = 0.0001;
            this.appleDestroyTime = 0
            this.runningTime = 0
            // this.currentViewShine =
            this.buildView()
            this.setColors()
            this.buildBG()
            this.buildApple()
            this.buildBucket()
            this.events()
            // this.buildTestPoint()//550  800
        }

        update(dt){
            this.runningTime += dt
            if(!this.apple) {
                this.nextCatch()
            } else {
                this.apple.update(dt)
                this.bucket.update(dt)
            }

            this.toRemove.forEach((item)=>{
                item.destroySelf()
            })

            this.toRemove = []
        }
        
        buildView(){
            this.view = new createjs.Container()
            this.view.compositeOperation = "darken"
        }

        buildTestPoint(){
            window.testPoint = new createjs.Shape()
            testPoint.graphics.f("black").dc(0,0,2)
            testPoint.x = testPoint.y = 300
            testPoint.compositeOperation = "source-over"
            this.view.addChild(testPoint)
        }

        nextCatch(){
            this.buildApple()
            this.bucket.view.x = this.apple.initX
        }


        setColors(){
            this.colorDict = {
                "r":{
                    color: "red",
                    filter: babyEye.redFilter
                },
                "b":{
                    color: "blue",
                    filter: babyEye.blueFilter
                }
            }

            let colors = this.trainInfor.glasses.split("")
            this.appleColor = this.colorDict[colors[0]]
            this.bucketColor = this.colorDict[colors[1]]
            // if(this.trainInfor.twinkleType == "lazy"){
            //     if(this.appleColor == this.trainInfor.targetInfor.color) {
            //         this.appleColor.twinkle = true
            //     }else {
            //         this.bucketColor.twinkle = true
            //     }
            // }
            // this.appleColor.twinkle = true
            // this.bucketColor.twinkle = true
        }

        buildBG(){
            this.bg = new createjs.Container()
            let bgColor = new createjs.Shape()
            bgColor.graphics.f("#ff00ff").dr(0,0,1280,720)
            let tree = new createjs.Bitmap(gameResource.getResult("tree"))
            tree.compositeOperation = "source-over"
            this.bg.addChild(bgColor,tree)
            this.view.addChild(this.bg)
        }

        buildApple(){
            this.apple = new Apple({
                world: this,
                x: Math.random()<0.5?
                babyEye.randomRange(200,550):
                babyEye.randomRange(800,1080),
                y: 100,
                color: this.appleColor
            })

            this.view.addChildAt(this.apple.view,0)
        }

        buildBucket(){
            this.bucket = new Bucket({
                world: this,
                x: this.apple.initX,
                y: 520,
                color: this.bucketColor
            })

            this.view.addChild(this.bucket.view)
        }

        judge(){
            if(this.apple) {
                if(this.apple.view.x > this.bucket.view.x + this.bucket.halfWidth) return false
                if(this.apple.view.x < this.bucket.view.x - this.bucket.halfWidth) return false
                if(this.apple.view.y > this.bucket.view.y + this.bucket.halfHeight) return false
                if(this.apple.view.y < this.bucket.view.y - this.bucket.halfHeight) return false
                return true
            }
        }

        events(){
            let keydown = false;
            $(window).unbind("keydown")
            $(window).bind("keydown", (ev)=>{
                if(ev.keyCode == 32 && !keydown){
                    this.handleEvent()
                    keydown = true;
                }
            })

            $(window).unbind("keyup");
            $(window).bind("keyup",(ev)=>{
                keydown = false;
            })

            this.game.stage.addEventListener("mousedown",()=>{
                this.handleEvent()
            })
        }

        handleEvent(){
            if(this.bucket.animating) return

            if(this.judge()) {
                this.beginAnimation()
                this.game.score.changeValue(1)
                createjs.Sound.play("wonderful", createjs.Sound.INTERRUPT_NONE,0,0,0,1,0);
            }
        }

        beginAnimation(){
            this.bucket.animateWith(this.apple);
        }
    }

    class Apple {
        constructor(config){
            this.world = config.world
            this.game = config.world.game
            this.initX = config.x
            this.initY = config.y
            this.color = config.color
            this.speed = 0.1
            this.buildTime = this.world.runningTime
            this.deltaMoveTime = babyEye.randomRange(1000,2000)
            this.buildView()
        }

        update(dt){
            if(this.freezeValue) return;
            if(this.world.runningTime - this.buildTime < this.deltaMoveTime) return
            if(this.world.animating) return
            this.view.y += this.speed * dt
            if(this.view.y > 720) {
                this.world.toRemove.push(this)
            }

            if(!this.minused && this.view.y > this.world.bucket.view.y + 100){
                this.outOfBucket();
            } 
        }

        outOfBucket(){
            this.game.score.changeValue(-1);
            this.minused = true;
            if(this.game.score.value < 0) this.game.score.setValue(0);
            createjs.Sound.play("wrong", createjs.Sound.INTERRUPT_NONE,0,0,0,1,0);

        }

        freeze(){
            this.freezeValue = true;
            this.view.x = this.world.bucket.view.x;
            this.view.y = this.world.bucket.view.y;
        }

        buildView(){
            this.img = new babyEye.ImageFiltered(gameResource.getResult('apple'), [this.color.filter])
            this.view = new createjs.Container()
            this.content = new createjs.Bitmap(this.img)
            this.width = this.img.width
            this.height = this.img.height
            this.r = this.width/2
            this.content.regX = 1/2 * this.width
            this.content.regY = 1/2 * this.height
            this.view.addChild(this.content)

            this.view.set({
                x: this.initX,
                y: this.initY
            })
            if(this.color.twinkle){
                createjs.Tween.get(this.view, {loop:true}).wait(80).to({visible: false}).wait(80).to({visible: true})   
            }
        }

        changeParent(parent){
            this.view.parent.removeChild(this.view);
            parent.addChild(this.view);
        }

        destroySelf(){
            if(this.view.parent) this.view.parent.removeChild(this.view)
            createjs.Tween.removeTweens(this.view)
            this.world.apple = null
        }
        
        removeSelf(){
            this.world.toRemove.push(this);
        }
    }

    class Bucket {
        constructor(config){
            this.world = config.world
            this.game = config.world.game
            this.initX = config.x
            this.initY = config.y
            this.color = config.color
            this.vx = 0.3;
            this.boundTimes = 0 ;
            this.buildView()
        }

        update(dt){
            if(!this.animating) return;
            if(this.boundTimes <= 2){
                let delta = this.vx * dt;
                this.view.x += delta;
                this.item.view.x += delta;
                // this.view.rotation += delta;
                // this.item.view.rotation += delta;
                if(this.view.x > this.lastPosition.x && this.boundTimes == 2) {
                    this.animating = false;
                    this.boundTimes = 0;
                    this.view.rotation = 0;
                    this.vx = Math.abs(this.vx);
                    this.item.removeSelf();
                    return;
                }

                if(this.view.x > this.game.width) {
                    this.view.x = this.game.width;
                    this.vx = -Math.abs(this.vx);
                    this.boundTimes += 1;
                } else if(this.view.x < 0) {
                    this.view.x = 0;
                    this.vx = Math.abs(this.vx);
                    this.boundTimes += 1;
                }
            }
        }

        animateWith(item){
            this.item = item;
            this.item.freeze();
            this.item.changeParent(this.view.parent);
            this.lastPosition = {x: this.view.x, y: this.view.y};
            this.animating = true;
        }

        buildView(){
            this.img = new babyEye.ImageFiltered(gameResource.getResult('bucket'), [this.color.filter])
            this.width = this.img.width
            this.height = this.img.height
            this.halfWidth = this.width/2
            this.halfHeight = this.height/2
            this.view = new createjs.Container()
            this.content = new createjs.Bitmap(this.img)
            this.content.regX = this.width/2
            this.content.regY = this.height/2
            this.view.addChild(this.content)
            this.view.set({
                x: this.initX,
                y: this.initY
            })

            if(this.color.twinkle){
                createjs.Tween.get(this.view, {loop:true}).wait(80).to({visible: false}).wait(80).to({visible: true})   
            }
        }
    }
})