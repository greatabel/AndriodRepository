"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(window).ready(function () {
    var prepareConfig = {
        instruction: "本训练为脱抑制训练，控制场景中的滑雪葱头，电脑端通过键盘左右方向键，移动设备可以通过点击场景左右控制葱头。不要让葱头滑出雪道，也不要撞到雪道上的石头。结束后会展示你滑行的最大路程。",
        selectGlasses: true, //是否需要选择眼镜
        selectLazyEye: true, //是否需要选择差眼，如果该项为true，则必须让selectGlasses也为true，因为需要眼镜信息来计算目标的正确颜色。脱抑制用。
        staticPath: "../../../static/", //该训练的html相对于static文件夹的路径
        // language: "en",
        callback: function callback(trainInfor) {
            // 完成选择后的回调函数，将开始训练放在其中，trainInfor是患者选择的结果
            //trainInfor.glasses为"rb"|"br"
            //trainInfor.difficulty为难度"easy"|"hard"|"medium"
            //trainInfor.twinkleType为闪烁模式 "altermate"|"lazy"|"same"
            //trainInfor.fuseType为融合模式 "center"|"round"|"entire"
            //targetInfor里面有color和filter，是脱抑制的目标颜色信息。打印看看
            // console.log(trainInfor)
            init(trainInfor); //选择完成后，开始训练函数
        }
    };

    babyEye.prepareTrain(prepareConfig); //选择训练参数和说明展示

    //begin for develop--------------------------------
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

    // let log = console.log;
    //end for develop------------------------------------
    //开始训练函数
    function init(trainInfor) {
        window.game = new Game(trainInfor);
    }
    //声明训练资源
    var gameResource = null;

    var Game = function () {
        function Game(trainInfor) {
            _classCallCheck(this, Game);

            this.trainInfor = trainInfor;
            this.stage = new createjs.Stage("game-canvas");
            this.stage.enableMouseOver();
            createjs.Tween.removeAllTweens();
            createjs.Touch.enable(this.stage);
            this.width = this.stage.canvas.width;
            this.height = this.stage.canvas.height;
            this.maxTravel = 0;
            this.lastFrame = 0;
            if (gameResource) {
                //如果已加载，不再重复加载
                this.onLoadingComplete();
            } else {
                this.loadResource();
            }
        }

        _createClass(Game, [{
            key: "loadResource",
            value: function loadResource() {
                var _this = this;

                $("#loading").show();
                gameResource = new createjs.LoadQueue();
                gameResource.setMaxConnections(100);
                gameResource.maintainScriptOrder = true;
                gameResource.installPlugin(createjs.Sound);
                gameResource.addEventListener("complete", function (ev) {
                    $("#loading").hide();
                    _this.onLoadingComplete();
                });

                var loadArr = [{ id: "bg", src: "../src2/an-ski/img/bg.png" }, { id: "ski", src: "../src2/an-ski/img/ski.png" }, { id: "ski-left", src: "../src2/an-ski/img/ski-left.png" }, { id: "ski-right", src: "../src2/an-ski/img/ski-right.png" }, { id: "ski", src: "../src2/an-ski/img/ski.png" }, { id: "stone-blue", src: "../src2/an-ski/img/stone-blue.png" }, { id: "stone-yellow", src: "../src2/an-ski/img/stone-yellow.png" }, { id: "tree", src: "../src2/an-ski/img/tree.png" }, { id: "flag", src: "../src2/an-ski/img/flag.png" }, { id: "fail", src: "../src2/an-ski/img/fail.png" }, { id: "go-ski", src: "../src2/an-ski/img/go-ski.png" }, { id: "first-page", src: "../src2/an-ski/img/first-page.png" }, { id: "result-page", src: "../src2/an-ski/img/result-page.png" }, { id: "retry", src: "../src2/an-ski/img/retry.png" }];

                loadArr = loadArr.concat([{ id: "wonderful", src: "../../../static/music/wonderful.mp3" }, { id: "collision", src: "../../../static/music/collision/fall-snow.mp3" }, { id: "mBG", src: "../../../static/music/bg/JingleBells.mp3" }]);
                gameResource.loadManifest(loadArr);
            }
        }, {
            key: "onLoadingComplete",
            value: function onLoadingComplete() {
                var _this2 = this;

                this.firstPage = new babyEye.Page({
                    bg: new createjs.Bitmap(gameResource.getResult("first-page")),
                    items: [{
                        content: new babyEye.Button("go-ski", gameResource, function () {
                            _this2.beginTrain();
                        }),
                        x: 970,
                        y: 630
                    }]
                });

                this.stage.addChild(this.firstPage.view);
                this.stage.update();
            }
        }, {
            key: "beginTrain",
            value: function beginTrain() {
                this.stage.removeAllChildren();
                this.buildWorld(); //产生训练场景
                this.buildButtons(); //产生训练按钮
                this.buildTravel();
                this.buildCountDown();
                this.render();
            }
        }, {
            key: "buildWorld",
            value: function buildWorld() {
                if (this.world) this.stage.removeChild(this.world.view);
                this.world = new World(this);
                this.stage.addChildAt(this.world.view);
                createjs.Sound.play("mBG", createjs.Sound.INTERRUPT_NONE, 0, 0, -1, 0.5, 0);
            }
        }, {
            key: "buildButtons",
            value: function buildButtons() {
                var _this3 = this;

                //参数为重新开始函数，返回类型bitmap
                this.replayButton = new babyEye.ReplayButton(function () {
                    _this3.replay();
                });
                this.helpButton = new babyEye.HelpButton(prepareConfig); //接受prepareConfig，返回类型bitmap
                this.stage.addChild(this.replayButton, this.helpButton);
            }
        }, {
            key: "buildTravel",
            value: function buildTravel() {
                this.travel = new babyEye.SkiTravel();
                this.stage.addChild(this.travel.view);
                this.travel.view.x -= 210;
            }
        }, {
            key: "buildCountDown",
            value: function buildCountDown() {
                var _this4 = this;

                if (this.countDown) this.stage.removeChild(this.countDown.view);
                var config = {
                    duration: 300 * 1000, //倒计时时间
                    callback: function callback() {
                        //倒计时为0时候的回调函数
                        _this4.end();
                    }
                };

                this.countDown = new babyEye.CountDown(config);
                this.stage.addChild(this.countDown.view);
            }
        }, {
            key: "render",
            value: function render() {
                var _this5 = this;

                var timestamp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

                if (this.pauseValue) return;
                if (this.failValue) return;

                var dt = timestamp - this.lastFrame;
                if (dt > 150 || dt < 0) dt = 0;
                this.lastFrame = timestamp;

                this.world.update(dt);
                this.countDown.update(dt);
                this.travel.setValue(this.world.travelSoFar);
                this.stage.update();

                requestAnimationFrame(function (timestamp) {
                    _this5.render(timestamp);
                });
            }
        }, {
            key: "pause",
            value: function pause() {
                this.pauseValue = true;
            }
        }, {
            key: "continue",
            value: function _continue() {
                if (this.pauseValue) {
                    this.pauseValue = false;
                    this.render();
                }
            }
        }, {
            key: "replay",
            value: function replay() {
                $(window).unbind(); //解绑事件
                this.stage.removeAllChildren();
                this.stage.removeAllEventListeners();
                createjs.Sound.stop();
                this.pause();
                babyEye.prepareTrain(prepareConfig);
            }
        }, {
            key: "succeed",
            value: function succeed() {
                var _this6 = this;

                this.stage.addChild(babyEye.successBitmap);
                setTimeout(function () {
                    _this6.stage.removeChild(babyEye.successBitmap);
                }, 1000);
            }
        }, {
            key: "fail",
            value: function fail() {
                var _this7 = this;

                createjs.Sound.play("collision", createjs.Sound.INTERRUPT_NONE, 0, 0, 0, 1, 0).on("complete", function () {
                    createjs.Sound.stop();
                });
                this.pause();
                //更新最大行驶数
                this.updatMaxTravel();
                setTimeout(function () {
                    _this7.buildWorld();
                    _this7.continue();
                }, 1500);
            }
        }, {
            key: "updatMaxTravel",
            value: function updatMaxTravel() {
                if (parseInt(this.world.travelSoFar) > parseInt(this.maxTravel)) this.maxTravel = this.world.travelSoFar;
            }
        }, {
            key: "end",
            value: function end() {
                var _this8 = this;

                this.pause();
                this.updatMaxTravel();
                var resultContent = new createjs.Text(this.maxTravel, "50px cursive", "white");
                resultContent.set({ textAlign: "center", textBaseline: "center" });
                this.resultPage = new babyEye.Page({
                    bg: new createjs.Bitmap(gameResource.getResult("result-page")),
                    items: [{
                        content: resultContent,
                        x: 655,
                        y: 315
                    }, {
                        content: new babyEye.Button("retry", gameResource, function () {
                            _this8.replay();
                        }),
                        x: 640,
                        y: 500
                    }]
                });
                this.stage.removeAllChildren();
                this.stage.addChild(this.resultPage.view);
                this.stage.update();
            }
        }]);

        return Game;
    }();

    var World = function () {
        function World(game) {
            _classCallCheck(this, World);

            this.game = game;
            this.view = new createjs.Container();
            this.runningTime = 0;
            this.travelSoFar = 0;
            this.buildBG();
            this.buildRoad();
            this.buildHero();
            this.events();
        }

        _createClass(World, [{
            key: "update",
            value: function update(dt) {
                this.runningTime += dt;
                this.road.update(dt);
                this.hero.update(dt);
                this.bg.update(dt);
                this.travelSoFar = (-this.road.view.y / 100).toFixed();

                if (this.road.checkCollide(this.hero)) {
                    this.handlCollision();
                };
            }
        }, {
            key: "events",
            value: function events() {
                var _this9 = this;

                this.keyMap = {};
                $(window).unbind("keydown");
                $(window).unbind("keyup");
                $(window).bind("keydown", function (ev) {
                    _this9.keyMap[ev.keyCode] = true;
                });
                $(window).bind("keyup", function (ev) {
                    _this9.keyMap[ev.keyCode] = false;
                });

                this.view.addEventListener("mousedown", function (ev) {
                    if (ev.stageX > _this9.game.width / 2) {
                        _this9.keyMap["39"] = true;
                    } else {
                        _this9.keyMap["37"] = true;
                    }
                });

                this.view.addEventListener("pressup", function (ev) {
                    _this9.keyMap["39"] = false;
                    _this9.keyMap["37"] = false;
                });
            }
        }, {
            key: "buildBG",
            value: function buildBG() {
                this.bg = new BG({ world: this });
                this.view.addChild(this.bg.view);
            }
        }, {
            key: "buildHero",
            value: function buildHero() {
                this.hero = new Hero({ world: this });
                this.view.addChild(this.hero.view);
                this.hero.view.set({
                    x: this.game.width / 2, y: 300
                });
            }
        }, {
            key: "buildRoad",
            value: function buildRoad() {
                this.road = new Road({ world: this });
                this.view.addChild(this.road.view);
                this.road.view.set({ x: this.game.width / 2, y: -100 });
            }
        }, {
            key: "handlCollision",
            value: function handlCollision() {
                this.hero.show("skiFail");
                this.game.fail();
            }
        }]);

        return World;
    }();

    var Road = function () {
        function Road(config) {
            _classCallCheck(this, Road);

            this.world = config.world;
            this.game = this.world.game;
            this.keyPoints = [new babyEye.Vec2(0, 0)];
            this.toRemove = [];
            this.stones = [];
            this.boundsY = -300;
            this.buildTypes();
            this.buildView();
        }

        _createClass(Road, [{
            key: "update",
            value: function update(dt) {
                var _this10 = this;

                this.view.y -= dt * this.world.hero.vy;
                if (this.view.y + this.keyPoints[0].y < this.boundsY) {
                    this.updateKeyPoint();
                    this.updateView();
                }

                this.toRemove.forEach(function (item) {
                    _this10.view.removeChild(item);
                    var index = _this10.stones.indexOf(item);
                    if (index != -1) {
                        createjs.Tween.removeTweens(item);
                        _this10.stones.splice(index, 1);
                    }
                });
                this.toRemove = [];
            }
        }, {
            key: "buildTypes",
            value: function buildTypes() {
                this.decorationType = 1;
                this.stoneType = 2;
            }
        }, {
            key: "buildView",
            value: function buildView() {
                this.view = new createjs.Container();
                this.path = new createjs.Shape();
                this.view.addChild(this.path);
                for (var i = 0; i < 5; i++) {
                    this.addKeyPoint();
                }
                this.updateView();
            }
        }, {
            key: "updateKeyPoint",
            value: function updateKeyPoint() {
                this.removeKeyPoint();
                this.addKeyPoint();
            }
        }, {
            key: "addKeyPoint",
            value: function addKeyPoint() {
                var lastHeight = this.keyPoints[this.keyPoints.length - 1].y;
                this.keyPoints.push(new babyEye.Vec2(babyEye.randomRange(-150, 200), lastHeight + 220));
            }
        }, {
            key: "removeKeyPoint",
            value: function removeKeyPoint() {
                this.keyPoints.shift();
            }
        }, {
            key: "updateView",
            value: function updateView() {
                this.updatePath();
                this.buildOtherItem(this.decorationType);
                if (Math.random() < 0.5) this.buildOtherItem(this.stoneType);
                this.removeOutOfBounds();
            }
        }, {
            key: "updatePath",
            value: function updatePath() {
                this.path.graphics.clear();
                var g = this.path.graphics.s("#e6e6e6").ss(500, "round", "round").mt(this.keyPoints[0].x, this.keyPoints[0].y);
                for (var i = 1; i < this.keyPoints.length; i++) {
                    g.lt(this.keyPoints[i].x, this.keyPoints[i].y);
                }
            }
        }, {
            key: "buildOtherItem",
            value: function buildOtherItem(type) {
                var imageID = void 0;
                if (type == this.stoneType) {
                    imageID = this.game.trainInfor.targetInfor.color == "blue" ? "stone-blue" : "stone-yellow";
                } else {
                    imageID = Math.random() < 0.3 ? "flag" : "tree";
                }
                var image = gameResource.getResult(imageID);
                var item = new createjs.Bitmap(image);
                item.set({ regX: image.width / 2, regY: image.height / 2 });
                this.view.addChild(item);
                if (imageID.indexOf("stone") != -1) {
                    this.stones.push(item);
                    createjs.Tween.get(item, { loop: true }).wait(80).to({ visible: false }).wait(80).to({ visible: true });
                }

                var lastTwoIndex = this.keyPoints.length - 2;
                var deltaX1 = this.keyPoints[lastTwoIndex].x - this.keyPoints[lastTwoIndex - 1].x;
                var deltaX2 = this.keyPoints[lastTwoIndex + 1].x - this.keyPoints[lastTwoIndex].x;

                if (deltaX1 * deltaX2 < 0) {
                    var offset = type == this.stoneType ? babyEye.randomRange(0, 100) : 300;
                    if (deltaX1 < 0) offset *= -1;
                    item.set({ x: this.keyPoints[lastTwoIndex].x + offset, y: this.keyPoints[lastTwoIndex].y });
                }
            }
        }, {
            key: "removeOutOfBounds",
            value: function removeOutOfBounds() {
                var _this11 = this;

                this.view.children.forEach(function (item) {
                    if (_this11.view.y + item.y < _this11.boundsY) {
                        if (item != _this11.path) _this11.toRemove.push(item);
                    }
                });
            }
        }, {
            key: "checkCollide",
            value: function checkCollide(other) {
                var _this12 = this;

                var result = false;
                other.collisionPoints.forEach(function (point) {
                    var pt = other.view.localToLocal(point.x, point.y, _this12.view);
                    if (!_this12.view.hitTest(pt.x, pt.y)) result = true;
                });

                other.collisionPoints.forEach(function (point) {
                    _this12.stones.forEach(function (stone) {
                        var pt = other.view.localToLocal(point.x, point.y, stone);
                        if (stone.hitTest(pt.x, pt.y)) result = true;
                    });
                });
                return result;
            }
        }]);

        return Road;
    }();

    var Hero = function () {
        function Hero(config) {
            _classCallCheck(this, Hero);

            this.world = config.world;
            this.game = this.world.game;
            this.maxVx = 0.3;
            this.maxVy = 0.3;
            this.vx = 0;
            this.vy = 0;
            this.accelerationY = 0.00005;
            this.buildView();
            this.buildCollisionPoints();
        }

        _createClass(Hero, [{
            key: "update",
            value: function update(dt) {
                this.adjustVelocity(dt);
                this.view.x += this.vx * dt;
            }
        }, {
            key: "buildView",
            value: function buildView() {
                this.view = new createjs.Container();
                this.skiStraight = new createjs.Bitmap(gameResource.getResult("ski"));
                this.skiLeft = new createjs.Bitmap(gameResource.getResult("ski-left"));
                this.skiRight = new createjs.Bitmap(gameResource.getResult("ski-right"));
                this.skiFail = new createjs.Bitmap(gameResource.getResult("fail"));
                this.point = new createjs.Shape();
                this.point.graphics.f("white").dc(0, 0, 10);

                this.view.addChild(this.skiStraight, this.skiLeft, this.skiRight, this.skiFail);
                this.view.children.forEach(function (ski) {
                    ski.set({ regX: ski.image.width / 2, regY: ski.image.height / 2, visible: false });
                });

                this.skiStraight.visible = true;
            }
        }, {
            key: "buildCollisionPoints",
            value: function buildCollisionPoints() {
                this.collisionPoints = [{ x: -40, y: 50 }, { x: 40, y: 50 }];
                this.collisionPoints.forEach(function (p) {
                    var testPoint = new createjs.Shape();
                    testPoint.graphics.f("white").dc(p.x, p.y, 30);
                    // this.view.addChild(testPoint);
                });
            }
        }, {
            key: "adjustVelocity",
            value: function adjustVelocity(dt) {
                if (this.world.keyMap["37"]) {
                    this.goLeft();
                } else if (this.world.keyMap["39"]) {
                    this.goRight();
                } else {
                    this.goStraight();
                }

                if (this.vy < this.maxVy) {
                    this.vy += dt * this.accelerationY;
                } else {
                    this.vy = this.maxVy;
                }
            }
        }, {
            key: "goLeft",
            value: function goLeft() {
                this.vx = -this.maxVx;
                this.show("skiLeft");
            }
        }, {
            key: "goRight",
            value: function goRight() {
                this.vx = this.maxVx;
                this.show("skiRight");
            }
        }, {
            key: "goStraight",
            value: function goStraight() {
                this.vx = 0;
                this.show("skiStraight");
            }
        }, {
            key: "show",
            value: function show(direction) {
                this.view.children.forEach(function (ski) {
                    ski.visible = false;
                });
                this[direction].visible = true;
            }
        }]);

        return Hero;
    }();

    var BG = function () {
        function BG(config) {
            _classCallCheck(this, BG);

            this.world = config.world;
            this.buildView();
        }

        _createClass(BG, [{
            key: "buildView",
            value: function buildView() {
                this.view = new createjs.Container();
                var bgUpper = new createjs.Bitmap(gameResource.getResult("bg"));
                var bgLower = bgUpper.clone();
                bgLower.y = bgUpper.image.height;
                this.bgHeight = bgUpper.image.height;
                this.view.addChild(bgLower, bgUpper);
            }
        }, {
            key: "update",
            value: function update(dt) {
                this.view.y -= dt * this.world.hero.vy;
                if (this.view.y < -this.bgHeight) {
                    this.view.y += this.bgHeight;
                }
            }
        }]);

        return BG;
    }();
});