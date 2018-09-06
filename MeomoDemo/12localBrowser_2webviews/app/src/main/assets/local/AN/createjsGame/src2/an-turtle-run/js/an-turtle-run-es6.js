$(window).ready(function(){
    let prepareConfig = {
        instruction: "本训练为脱抑制训练，场景中出现一只你可以控制的乌龟，可通过按键盘上下按键，或者场景中的上下按钮控制。使你控制的乌龟不要撞到其他乌龟。每超过一个乌龟加一分，撞到一只乌龟扣一分，看看你能得到多少分吧！(家长可帮助操作)",
        selectGlasses: true,//是否需要选择眼镜
        selectLazyEye: true,//是否需要选择差眼，如果该项为true，则必须让selectGlasses也为true，因为需要眼镜信息来计算目标的正确颜色。脱抑制用。
        selectTwinkleType: false,//是否有闪烁模式选择
        staticPath: "../../../static/",//该训练的html相对于static文件夹的路径
        // language: "en",
        callback: (trainInfor)=>{// 完成选择后的回调函数，将开始训练放在其中，trainInfor是患者选择的结果
            //trainInfor.glasses为"rb"|"br"
            //trainInfor.difficulty为难度"easy"|"hard"|"medium"
            //trainInfor.twinkleType为闪烁模式 "altermate"|"lazy"|"same"
            //trainInfor.fuseType为融合模式 "center"|"round"|"entire"
            //targetInfor里面有color和filter，是脱抑制的目标颜色信息。打印看看
            // console.log(trainInfor)
            init(trainInfor)//选择完成后，开始训练函数
        }
    }

    babyEye.prepareTrain(prepareConfig)//选择训练参数和说明展示

    // //begin for develop--------------------------------
    // let prepareConfig = {
    //     staticPath: "../../../static/",//该训练的html相对于static文件夹的路径
    //     callback: ()=>{
    //         let trainInfor = {
    //             glasses:"rb",
    //             difficulty: "easy",
    //             twinkleType: "altermate",
    //             fuseType: "center",
    //             targetInfor:{color: "red", filter: new createjs.ColorFilter(1,0,0,1,255,0,0,0)}
    //         }
    //         init(trainInfor)//选择完成后，开始训练函数
    //     }
    // }

    // babyEye.prepareTrain(prepareConfig)
    // //end for develop------------------------------------
    let utils = {
        checkCollide: (a, b) => {
            if(a.view.x > b.view.x + b.width) return false
            if(a.view.x + a.width < b.view.x) return false
            if(a.view.y + a.height < b.view.y) return false
            if(a.view.y > b.view.y + b.height) return false
            return true
        }
    }

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
            createjs.Tween.removeAllTweens()
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
                {id: "bg", src: "../src2/an-turtle-run-en/img/bg.png"},
                {id: "rabbit", src: "../src2/an-turtle-run-en/img/rabbit.png"},
                {id: "turtle0", src: "../src2/an-turtle-run-en/img/turtle0.png"},
                {id: "turtle1", src: "../src2/an-turtle-run-en/img/turtle1.png"},
                {id: "turtle2", src: "../src2/an-turtle-run-en/img/turtle2.png"},
                {id: "down", src: "../src2/an-turtle-run-en/img/down.png"},
                {id: "down-hover", src: "../src2/an-turtle-run-en/img/down-hover.png"},
                {id: "up", src: "../src2/an-turtle-run-en/img/up.png"},
                {id: "up-hover", src: "../src2/an-turtle-run-en/img/up-hover.png"},
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

            this.moveUpButton = new babyEye.InteractiveButton(gameResource.getResult("up"), gameResource.getResult("up-hover"),()=>{
                this.world.myTurtle.moveUp()
            })

            this.moveDownButton = new babyEye.InteractiveButton(gameResource.getResult("down"), gameResource.getResult("down-hover"),()=>{
                this.world.myTurtle.moveDown()
            })

            this.moveUpButton.x = 900
            this.moveUpButton.y = 590

            this.moveDownButton.x = 1100
            this.moveDownButton.y = 590

            this.stage.addChild(this.moveUpButton, this.moveDownButton)
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
            this.targetInfor = this.game.trainInfor.targetInfor
            this.view = new createjs.Container()
            this.view.compositeOperation = "darken"
            this.toRemove = []
            this.turtles = []
            this.beginLine = 1800
            this.speed = 0.2
            this.lastTurtleTime = 0
            this.runningTime = 0
            this.lastWonderfulScore = 0
            this.setPositions()
            this.buildRoad()
            this.buildTurtles()
            this.buildMyTurtle()
            // this.buildTestPoint()
            this.events()
            // this.addGamePads()
        }

        update(dt){
            this.runningTime += dt
            // this.gamePads.update()
            // this.updateGamePadsEvents(dt)
            this.road.update(dt)
            this.turtles.forEach((turtle)=>{
                turtle.update(dt)
                if(!turtle.scored &&!turtle.collided && turtle.view.x < this.myTurtle.view.x) {
                    turtle.scored = true
                    this.game.score.changeValue(1)
                    if(this.game.score.value - this.lastWonderfulScore > 3) {
                        createjs.Sound.play("wonderful", createjs.Sound.INTERRUPT_NONE,0,0,0,1,0)
                        this.lastWonderfulScore = this.game.score.value
                    }else {
                        createjs.Sound.play("pass", createjs.Sound.INTERRUPT_NONE,0,0,0,1,0)
                    }
                    this.showFlag("+1")
                }
            })
            this.toRemove.forEach((item)=>{
                item.destroySelf()
            })
            this.toRemove = []

            if(this.checkCollide()){
                this.game.score.changeValue(-1)
                this.showFlag("-1")
                if(this.game.score.value < 0) this.game.score.setValue(0)
                createjs.Sound.play("collision", createjs.Sound.INTERRUPT_NONE,0,0,0,1,0)
            }

            if(this.runningTime - this.lastTurtleTime > 12000) {
                this.lastTurtleTime = this.runningTime
                this.buildTurtles()
            }
        }

        addGamePads(){
            let padMap = {
                buttons: {
                    3: "up",//Y->up
                    0: "down" //A->down
                }
            }

            let config = {
                padMap: padMap,
                deadZone: 0.1
            }
            this.gamePads = new GamePads(config)
        }

        updateGamePadsEvents(dt){
            if(this.gamePads.justPressed("up")){
                this.myTurtle.moveUp()
            }

            if(this.gamePads.justPressed("down")){
                this.myTurtle.moveDown()
            }
        }

        showFlag(text){
            let flag = null
            this.view.removeChild(this.flag)
            flag = this.flag = new createjs.Text(text, "50px fantasy", "yellow")
            this.flag.set({x: this.myTurtle.view.x + 30, y:this.myTurtle.view.y,compositeOperation: "source-over"})
            this.view.addChild(this.flag)
            setTimeout(()=>{
                this.view.removeChild(flag)
            },1000)
        }

        checkCollide() {
            for(let i = 0; i < this.turtles.length; i++){
                let enemyTurtle = this.turtles[i]
                if( !enemyTurtle.collided && utils.checkCollide(enemyTurtle, this.myTurtle)){
                    enemyTurtle.collided = true
                    return true
                }
            }

            return false
        }

        buildTestPoint(){
            window.testPoint = new createjs.Shape()
            testPoint.graphics.f("black").dc(0,0,2)
            testPoint.x = testPoint.y = 300
            testPoint.compositeOperation = "source-over"
            this.view.addChild(testPoint)
        }

        setPositions(){
            this.positionsY = []
            for(let i = 0; i < 4; i++){
                this.positionsY.push((585 - 160)/4 * i + 180)
            }
        }

        buildRoad(){
            this.road = new Road({
                world: this
            })
            this.view.addChild(this.road.view)
        }

        buildTurtles(){
            let originalImg = gameResource.getResult("turtle" + babyEye.randomRange(1,3))
            let img = new babyEye.ImageFiltered(originalImg, [this.game.trainInfor.targetInfor.color == "red"? babyEye.blueFilter:babyEye.redFilter])
            for(let i = 0; i < 2; i++){
                let turtle =  new Turtle({
                    world: this,
                    img: img,
                    x: this.beginLine + babyEye.randomRange(-500,500),
                    y: this.positionsY[Math.random() < 0.5 ? 2 * i : 2 * i + 1]
                })
                this.turtles.push(turtle)
                this.view.addChild(turtle.view)
            }
        }

        buildMyTurtle(){
            let originalImg = gameResource.getResult("turtle0")
            let img = new babyEye.ImageFiltered(originalImg, [this.game.trainInfor.targetInfor.filter])
            this.myTurtle = new Turtle({
                world: this,
                img: img,
                x: 300,
                y: this.positionsY[0]
            })

            this.view.addChild(this.myTurtle.view)
            createjs.Tween.get(this.myTurtle.view, {loop:true}).wait(80).to({visible: false}).wait(80).to({visible: true})
        }

        events(){
            document.addEventListener("keydown",(ev)=>{
                let code = ev.keyCode

                if (code == 38) {
                    this.myTurtle.moveUp()
                } else if (code == 40) {
                    this.myTurtle.moveDown()
                }
            })
        }
    }

    class Turtle {
        constructor(config){
            this.world = config.world
            this.game = config.world.game
            this.img = config.img
            this.initX = config.x
            this.initY = config.y
            this.buildView()
            this.setPositions()
        }

        update(dt){
            this.view.x -= this.world.speed * dt

            if(this.view.x < -300) {
                this.world.toRemove.push(this)
            }
        }

        buildView(){
            this.view = new createjs.Container()
            this.content = new createjs.Bitmap(this.img)
            this.width = this.img.width
            this.height = this.img.height
            this.view.addChild(this.content)
        }

        setPositions(){
            this.view.set({
                x: this.initX,
                y: this.initY
            })
            this.currentIndex = this.world.positionsY.indexOf(this.view.y)
        }

        destroySelf(){
            let index = this.world.turtles.indexOf(this)
            if(index != -1){
                this.world.turtles.splice(index,1)
                this.view.parent.removeChild(this.view)
                createjs.Tween.removeTweens(this.view)
            }
        }

        moveUp(){
            this._move(-1)
        }

        moveDown(){
            this._move(1)
        }

        _move(step){
            this.currentIndex += step
            if(this.currentIndex < 0){
                this.currentIndex = 0
            } else if(this.currentIndex >= this.world.positionsY.length) {
                this.currentIndex = this.world.positionsY.length - 1
            }
            this.view.y = this.world.positionsY[this.currentIndex]
        }
    }

    class Road {
        constructor(config){
            this.world = config.world
            this.buildView()
        }

        buildView(){
            let img = gameResource.getResult("bg")
            this.view = new createjs.Container()
            this.roadBack = new createjs.Bitmap(img)
            this.roadForward = this.roadBack.clone()
            this.roadForward.x = 1280
            this.view.addChild(this.roadBack,this.roadForward)
        }

        update (dt){
            this.view.x -= dt * this.world.speed
            if(this.view.x < -1280) {
                this.view.x += 1280
            }
        }
    }
})