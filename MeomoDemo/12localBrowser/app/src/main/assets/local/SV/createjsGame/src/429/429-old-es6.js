$(window).ready(function() {
    window.init = ()=>{
        window.queue = new createjs.LoadQueue();
        let loadingValue = $("#loading span")
        queue.installPlugin(createjs.Sound);
        queue.loadManifest([
            {id: "wonderful", src: "../../../static/music/wonderful.mp3"},
            {id: "click", src: "../../../static/music/click.mp3"},
            {id: "mBG", src: "../../../static/music/3.mp3"},
            {id: "gun", src: "../src/429/gun.png"},
            {id: "target", src: "../src/429/target.png"},
            {id: "bg", src:"../src/429/gratings.png"}
        ])
        queue.addEventListener("complete", function() {
            window.game = new Game();
            createjs.Sound.play("mBG", createjs.Sound.INTERRUPT_NONE,0,0,-1,.5,0);
        });
        queue.addEventListener("progress", (ev)=>{
            loadingValue.text((ev.progress * 100).toFixed() + "%");
            console.log(ev.progress);
            if (ev.progress == 1) {
                $("#loading").hide();
            }
        })

    }

    class Game {
        constructor() {
            this.stage = new c.Stage("game-canvas");
            this.stage.cursor = "none";
            c.Touch.enable(this.stage);
            this.stage.enableMouseOver();
            this.width = this.stage.canvas.width;
            this.height = this.stage.canvas.height;
            this.stop = false;
            this.bgFilter = new createjs.ColorFilter(1,0,1,1,0,0,0);
            this.gunFilter = new c.ColorFilter(0,0,0,1,255,0,128);
            this.buildWorld();
            this.render()
        }

        render() {
            if(this.stop) return;
            this.stage.update();
            window.requestAnimationFrame(()=>{
                this.render();
            });
        }

        buildWorld() {
            this.world = new World(this);
            this.stage.addChild(this.world);
        }

        reset() {
            this.stop = true;
            this.stage.removeAllChildren();
            this.stage.removeAllEventListeners();
            window.game = new Game();
        }

        success(){
            createjs.Sound.play("wonderful", createjs.Sound.INTERRUPT_NONE,0,0,0,.5,0)
            this.world.timesRemain--;
            if(this.world.timesRemain == 0){
                this.world.level++;
                this.world.timesRemain = this.world.level;
            }

            window.showSuccess();
            setTimeout(()=>{
                window.hideSuccess();
            },800);
        }

        fail(){
            this.world.level--;
            if(this.world.level <= 1) this.world.level = 1;
            this.world.timesRemain = this.world.level;

            window.showFail();
            setTimeout(()=>{
                window.hideFail();
            }, 800)
        }

        pause() {

        }

        continue() {

        }
    }

    class World extends c.Container {
        constructor(game){
            super();
            this.game = game;
            this.level = 1;
            this.timesRemain = 1;
            this.bgObj = new BG(this.game);
            this.gun = new Gun(this.game);
            this.target = new Target(this.game);
            this.buildLevelText();
            this.addChild(this.bgObj,this.target,this.gun);
            this.addEvents();
        }

        buildLevelText() {
            this.levelObj = new createjs.Text("等级：" + this.level, "20px Arial", "black");
            this.levelObj.x = this.game.width - 140;
            this.levelObj.y = this.game.height - 40;
            this.addChild(this.levelObj);
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
            if(this.level > 2) {
                thresholed = 8;
            }
            if(this.level > 4) {
                thresholed = 7;
            }

            if(this.level > 6) {
                thresholed = 6;
            }

            if(this.level > 8) {
                thresholed = 5;
            }

            if(distance < thresholed){
                this.game.success();
            } else {
                this.game.fail();
            }

            this.updateObjects();
        }

        updateObjects() {
            this.target.set({
                x: babyEye.randomRange(250,this.game.width-250),
                y: babyEye.randomRange(250, this.game.height-250),
                scaleX: this.level < 5 ?(11 - this.level)/10 : 0.5,
                scaleY: this.level < 5 ?(11 - this.level)/10 : 0.5
            })

            this.gun.set({
                scaleX: this.level < 5 ?(11 - this.level)/10 : 0.5,
                scaleY: this.level < 5 ?(11 - this.level)/10 : 0.5
            })

            this.levelObj.text = "等级：" + this.level;
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
            let originalImg = window.queue.getResult("target");
            let filteredImg = new FilteredImg(window.queue.getResult("target"), [window.filters[0]]).getImg();

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

    class BG extends c.Container {
        constructor(game) {
            super();
            this.game = game;
            let originalImg = queue.getResult("bg");
            let spriteObj = {
                "images": [new FilteredImg(originalImg, [this.game.bgFilter]).getImg()],
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
            let originalImg = new FilteredImg(window.queue.getResult("gun"), [window.filters[1]]).getImg();
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
})