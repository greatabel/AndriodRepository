$(window).ready(function(){
    // let prepareConfig = {
    //     instruction: "本训练为脱抑制训练，场景中出现一只你可以控制的乌龟，可通过按键盘上下按键，或者场景中的上下按钮控制。使你控制的乌龟不要撞到其他乌龟。每超过一个乌龟加一分，撞到一只乌龟扣一分，看看你能得到多少分吧！(家长可帮助操作)",
    //     selectGlasses: true,//是否需要选择眼镜
    //     selectLazyEye: true,//是否需要选择差眼，如果该项为true，则必须让selectGlasses也为true，因为需要眼镜信息来计算目标的正确颜色。脱抑制用。
    //     selectTwinkleType: true,//是否有闪烁模式选择
    //     staticPath: "../../../static/",//该训练的html相对于static文件夹的路径
    //     callback: (trainInfor)=>{// 完成选择后的回调函数，将开始训练放在其中，trainInfor是患者选择的结果
    //         //trainInfor.glasses为"rb"|"br"
    //         //trainInfor.difficulty为难度"easy"|"hard"|"medium"
    //         //trainInfor.twinkleType为闪烁模式 "altermate"|"lazy"|"same"
    //         //trainInfor.fuseType为融合模式 "center"|"round"|"entire"
    //         //targetInfor里面有color和filter，是脱抑制的目标颜色信息。打印看看
    //         //console.log(trainInfor)
    //         init(trainInfor)//选择完成后，开始训练函数
    //     }
    // }

    // babyEye.prepareTrain(prepareConfig)//选择训练参数和说明展示

    //begin for develop--------------------------------
    let prepareConfig = {
        staticPath: "../../../static/",//该训练的html相对于static文件夹的路径
        callback: ()=>{
            let trainInfor = {
                glasses:"br",
                difficulty: "easy",
                twinkleType: "altermate",
                fuseType: "center",
                targetInfor:{color: "red", filter: new createjs.ColorFilter(1,0,0,1,255,0,0,0)}
            }
            init(trainInfor)//选择完成后，开始训练函数
        }
    }

    babyEye.prepareTrain(prepareConfig)
    let log = console.log.bind(console)
    //end for develop------------------------------------
    let utils = {
        checkCollide: (a, b) => {
            if(a.view.x > b.view.x + b.width) return false
            if(a.view.x + a.width < b.view.x) return false
            if(a.view.y + a.height < b.view.y) return false
            if(a.view.y > b.view.y + b.height) return false
            return true
        },
        fdJson: {
            density: 1,
            friction: 0,
            restitution: 0
        },
        toMeter: 1/30
    }

    //开始训练函数
    function init(trainInfor){
        window.game = new Game(trainInfor)
    }
    //声明训练资源
    let gameResource = null

    class Base {
        update() {
            this.view.x = this.body.GetPosition().x * 30;//this.world.toPx;
            this.view.y = this.body.GetPosition().y * 30;//this.world.toPx;
            this.view.rotation = this.body.GetAngle() * 57.3; // 180/Math.PI;
        }
    }

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
                {id: "collision", src: "../../../static/music/collision/1.mp3"},
                {id: "pass", src: "../../../static/music/click/1.mp3"},
                {id: "mBG", src: "../../../static/music/bg/s13.mp3"},
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
            this.g = 1;
            this.b2world = new b2World(new b2Vec2(0, this.g), false)
            this.toMeter = 1/30
            this.buildView()
            this.setColors()
            this.buildBG()
            this.buildApple()
            this.buildBucket()
            this.events()
            this.buildDebugDraw()
        }

        update(dt){
            this.runningTime += dt
            this.b2world.Step(
                  dt * 0.001   //frame-rate
               ,  8       //velocity iterations
               ,  8       //position iterations
            );
            this.b2world.DrawDebugData();
            this.b2world.ClearForces();
            this.toRemove.forEach((item)=>{
                item.destroySelf()
            })
            this.toRemove = []
            if(!this.apple) {
                this.buildApple()
            } else {
                this.apple.update()
            }

            this.bucket.update()
        }

        buildView(){
            this.view = new createjs.Container()
            this.view.compositeOperation = "darken"
            this.animationContainer = new createjs.Container()
        }

        // buildTestPoint(){
        //     window.testPoint = new createjs.Shape()
        //     testPoint.graphics.f("black").dc(0,0,2)
        //     testPoint.x = testPoint.y = 300
        //     testPoint.compositeOperation = "source-over"
        //     this.view.addChild(testPoint)
        // }

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
                x: 450,
                y: 200,
                color: this.appleColor
            })

            this.view.addChild(this.apple.view)
        }

        buildBucket(){
            this.bucket = new Bucket({
                world: this,
                x: 500,
                y: 400,
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
            $(window).unbind("keydown")
            $(window).bind("keydown", (ev)=>{
                if(ev.keyCode == 32){
                    if(this.judge()) {
                        this.beginAnimation()
                    }
                }
            })
        }

        beginAnimation(){
            
        }


        buildDebugDraw() {
            let debugDraw = new b2DebugDraw();
            debugDraw.SetSprite(document.getElementById("box2d-debug").getContext("2d"));
            debugDraw.SetDrawScale(30.0);
            debugDraw.SetFillAlpha(0.3);
            debugDraw.SetLineThickness(1.0);
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
            this.b2world.SetDebugDraw(debugDraw);
        }
    }

    class Apple extends Base{
        constructor(config){
            super()
            this.world = config.world
            this.game = config.world.game
            this.initX = config.x
            this.initY = config.y
            this.color = config.color
            this.speed = 0
            this.g = 0.0001
            this.updateByPhy = true
            this.buildView()
            this.buildBody()
        }

        update(dt){
            if(this.updateByPhy){
                super.update()
            }
            if(this.view.y > 600) {
                this.world.toRemove.push(this)
            }
        }

        buildBody(){
            let bd = new b2BodyDef();
            bd.type = b2Body.b2_dynamicBody;
            bd.position.x = this.initX * utils.toMeter;
            bd.position.y = this.initY * utils.toMeter;

            let fd = new b2FixtureDef();
            fd.restitution = utils.fdJson.restitution;
            fd.friction = utils.fdJson.friction;
            fd.density = utils.fdJson.density;
            fd.shape = new b2CircleShape(this.r * utils.toMeter);

            this.body = this.world.b2world.CreateBody(bd);
            this.fixture = this.body.CreateFixture(fd);
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
            this.view.x = this.view.y = -1000
            this.view.addChild(this.content)
            // createjs.Tween.get(this.view, {loop:true}).wait(80).to({visible: false}).wait(80).to({visible: true})
        }

        destroySelf(){
            this.view.parent.removeChild(this.view)
            createjs.Tween.removeTweens(this.view)
            this.world.b2world.DestroyBody(this.body)
            this.world.apple = null
        }
    }

    class Bucket extends Base {
        constructor(config){
            super()
            this.world = config.world
            this.game = config.world.game
            this.initX = config.x
            this.initY = config.y
            this.color = config.color
            this.updateByPhy = true
            this.buildView()
            this.buildBody()
        }

        buildBody(){
            let bd = new b2BodyDef();
            bd.type = b2Body.b2_kinematicBody;
            bd.position.x = this.initX * utils.toMeter;
            bd.position.y = this.initY * utils.toMeter;
            this.body = this.world.b2world.CreateBody(bd);

            let fd = new b2FixtureDef()
            fd.density = utils.fdJson.density
            fd.friction = utils.fdJson.friction
            fd.restitution = utils.fdJson.restitution
            fd.shape = new b2PolygonShape()
            let delta = 20 * utils.toMeter

            fd.shape.SetAsEdge(
                new b2Vec2(-this.halfWidth * utils.toMeter, -this.halfHeight * utils.toMeter),
                new b2Vec2(-this.halfWidth * utils.toMeter + delta, this.halfHeight * utils.toMeter)
            )
            this.body.CreateFixture(fd)

            fd.shape.SetAsEdge(
                new b2Vec2(this.halfWidth * utils.toMeter, -this.halfHeight * utils.toMeter),
                new b2Vec2(this.halfWidth * utils.toMeter - delta, this.halfHeight * utils.toMeter)
            )
            this.body.CreateFixture(fd)
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
            this.view.x = this.view.y = -1000
            this.view.addChild(this.content)
            // createjs.Tween.get(this.view, {loop:true}).wait(80).to({visible: false}).wait(80).to({visible: true})
        }

        update(){
            if(this.updateByPhy)
            super.update()
        }
    }
})