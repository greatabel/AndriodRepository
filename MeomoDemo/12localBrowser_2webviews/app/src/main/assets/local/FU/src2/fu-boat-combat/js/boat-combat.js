"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(window).ready(function () {
    //如果遇到错误，联系Barry修改
    var prepareConfig = {
        selectGlasses: true, //是否需要选择眼镜
        // selectFuseType: true,//是否有融合模式选择
        testForFU: true, //是否进行融合测试，选择该项，必须选择眼镜

        //以上属性，均为可选，没有该属性默认false或其他默认值！！！！！！！！！！

        //instruction 可以是字符串，也可以用下面的形式加载说明图片（建议使用下划线开头的id名称）
        instruction: "本训练为融合训练，训练前会测量你的融合能力。训练场景中有过往的船只，下方有来回移动的大炮。请你通过空格键，或者点击场景中的任意位置开炮，请将大的轮船，不要伤害到小的帆船。打中轮船得一分，打中帆船减一分。",
        // instruction: {id: "_instruction", src: "../src2/fu-boat-combat/img/_instruction.png"},
        staticPath: "../../static/", //该训练的html相对于static文件夹的路径
        callback: function callback(trainInfor) {
            // 完成选择后的回调函数，将开始训练放在其中，trainInfor是患者选择的结果
            //trainInfor.glasses为"rb"|"br"
            //trainInfor.difficulty为难度"easy"|"hard"|"medium"
            //trainInfor.twinkleType为闪烁模式 "altermate"|"lazy"|"same"
            //trainInfor.fuseType为融合模式 "center"|"round"|"entire"
            //trainInfor.vergenceType的结果是"convergence"|"divergence"，对应集合和散开
            //trainInfor.convergenceDelta 是集合时，左右相差的最大距离，单位是像素
            //trainInfor.divergenceDelta 是散开时，左右相差的最大距离，单位是像素
            //targetInfor里面有color和filter，是脱抑制的目标颜色信息。打印看看
            console.log(trainInfor);
            init(trainInfor); //选择完成后，开始训练函数
        }
    };

    babyEye.prepareTrain(prepareConfig); //选择训练参数和说明展示

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

    var Base = function () {
        function Base() {
            _classCallCheck(this, Base);
        }

        _createClass(Base, [{
            key: "update",
            value: function update() {
                this.view.x = this.body.GetPosition().x * 30; //this.world.toPx;
                this.view.y = this.body.GetPosition().y * 30; //this.world.toPx;
                this.view.rotation = this.body.GetAngle() * 57.3; // 180/Math.PI;
            }
        }]);

        return Base;
    }();

    var utils = {
        checkCollide: function checkCollide(a, b) {
            if (a.view.x > b.view.x + b.width) return false;
            if (a.view.x + a.width < b.view.x) return false;
            if (a.view.y + a.height < b.view.y) return false;
            if (a.view.y > b.view.y + b.height) return false;
            return true;
        },
        fdJson: {
            density: 1,
            friction: 0,
            restitution: 0
        },
        toMeter: 1 / 30

        //开始训练函数
    };function init(trainInfor) {
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
            createjs.Touch.enable(this.stage);
            this.width = this.stage.canvas.width;
            this.height = this.stage.canvas.height;
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
                //训练资源第一次，唯一一次赋值
                gameResource = new createjs.LoadQueue();
                //加载并发
                gameResource.setMaxConnections(100);
                // 关键！---一定要将其设置为 true, 否则不起作用。  
                gameResource.maintainScriptOrder = true;
                gameResource.installPlugin(createjs.Sound);

                //添加加载事件
                gameResource.addEventListener("complete", function (ev) {
                    $("#loading").hide();
                    $("body").addClass("pink-bg");
                    _this.onLoadingComplete();
                });
                //加载资源路径
                var loadArr = [{ id: "cannon", src: "../src2/fu-boat-combat/img/cannon.png" }, { id: "bg", src: "../src2/fu-boat-combat/img/bg.png" }, { id: "trader", src: "../src2/fu-boat-combat/img/trader.png" }, { id: "pirate", src: "../src2/fu-boat-combat/img/pirate.png" }, { id: "cannon", src: "../src2/fu-boat-combat/img/cannon.png" }, { id: "explosion", src: "../src2/fu-boat-combat/img/explosion_13.png" }, { id: "bullet", src: "../src2/fu-boat-combat/img/bullet.png" }, { id: "collision", src: "../../static/music/collision/1.mp3" }, { id: "fire", src: "../../static/music/click/1.mp3" }, { id: "mBG", src: "../../static/music/bg/s10.mp3" }, { id: "wonderful", src: "../../static/music/wonderful.mp3" }];

                //加载
                gameResource.loadManifest(loadArr);
            }
        }, {
            key: "onLoadingComplete",
            value: function onLoadingComplete() {
                this.stage.removeAllChildren();
                this.buildWorld(); //产生训练场景
                this.buildButtons(); //产生训练按钮
                this.buildScore(); //产生得分类
                this.render();
                createjs.Sound.play("mBG", createjs.Sound.INTERRUPT_NONE, 0, 0, -1, 0.5, 0);
            }
        }, {
            key: "buildWorld",
            value: function buildWorld() {
                this.world = new World(this);
                this.stage.addChildAt(this.world.view, 0);
            }
        }, {
            key: "buildButtons",
            value: function buildButtons() {
                var _this2 = this;

                //参数为重新开始函数，返回类型bitmap
                this.replayButton = new babyEye.ReplayButton(function () {
                    _this2.replay();
                });
                this.helpButton = new babyEye.HelpButton(prepareConfig); //接受prepareConfig，返回类型bitmap

                this.stage.addChild(this.replayButton, this.helpButton);
            }
        }, {
            key: "buildScore",
            value: function buildScore() {
                this.score = new babyEye.Score(0, 0); //还有当前关数类，是babyEye.Level,用法完全一样，只是背景文字不同。
                this.stage.addChild(this.score.view);

                //用法
                // this.score.setValue(5)//设置当前的数值
                // this.score.changeValue(-3)//将当前数值减三
                this.score.value; //获取当前数值值
            }
        }, {
            key: "render",
            value: function render() {
                var _this3 = this;

                var timestamp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

                if (this.pauseValue) return;
                if (this.failValue) return;

                var dt = timestamp - this.lastFrame;
                if (dt > 150 || dt < 0) dt = 0;
                this.lastFrame = timestamp;

                this.world.update(dt);
                this.stage.update();

                requestAnimationFrame(function (timestamp) {
                    _this3.render(timestamp);
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
            key: "succeed",
            value: function succeed() {
                createjs.Sound.play("wonderful", createjs.Sound.INTERRUPT_NONE, 0, 0, 0, 1, 0);
                this.score.changeValue(1);
            }
        }, {
            key: "fail",
            value: function fail() {
                createjs.Sound.play("collision", createjs.Sound.INTERRUPT_NONE, 0, 0, 0, 1, 0);
                this.score.changeValue(-1);
                if (this.score.value < 0) {
                    this.score.setValue(0);
                }
            }
        }, {
            key: "replay",
            value: function replay() {
                $(window).unbind(); //解绑事件
                this.stage.removeAllChildren();
                this.stage.removeAllEventListeners();
                this.stage.enableMouseOver(0);
                this.pause();
                createjs.Sound.stop();
                babyEye.prepareTrain(prepareConfig);
            }
        }]);

        return Game;
    }();

    var World = function () {
        function World(game) {
            _classCallCheck(this, World);

            this.game = game;
            this.view = new createjs.Container();
            this.shipHeights = [250, 350, 450];
            this.lastBuildHeightIndex = 0;
            this.lastBuildTime = 0;
            this.runningTime = 0;
            this.b2world = new b2World(new b2Vec2(0, 0), true);
            this.toRemove = [];
            // this.view.compositeOperation = "darken";
            this.buildBG();
            this.buildCannon();
            this.buildShip();
            this.physicsEvents();
            this.events();
            // this.buildDebugDraw();
        }

        _createClass(World, [{
            key: "update",
            value: function update(dt) {
                this.runningTime += dt;
                this.b2world.Step(dt * 0.001 //frame-rate
                , 8 //velocity iterations
                , 8 //position iterations
                );
                // this.b2world.DrawDebugData();
                this.b2world.ClearForces();

                var current = this.b2world.GetBodyList();
                while (current && current.GetUserData()) {
                    current.GetUserData().update(dt);
                    current = current.GetNext();
                }

                this.toRemove.forEach(function (item) {
                    item.destroySelf();
                });

                this.toRemove = [];
                this.cannon.update(dt);

                if (this.runningTime - this.lastBuildTime > 5000) {
                    this.buildShip();
                    this.lastBuildTime = this.runningTime;
                }
            }
        }, {
            key: "physicsEvents",
            value: function physicsEvents() {
                var _this4 = this;

                this.listener = new b2ContactListener();
                this.b2world.SetContactListener(this.listener);
                this.listener.BeginContact = function (contact) {
                    var o1 = contact.GetFixtureA().GetBody().GetUserData();
                    var o2 = contact.GetFixtureB().GetBody().GetUserData();
                    var ship = o1 instanceof Ship ? o1 : o2;
                    if (!(ship instanceof Ship)) return;

                    _this4.toRemove.push(o1, o2);
                    var explosion = new Explosion(ship.view.x, ship.view.y);
                    _this4.view.addChild(explosion);

                    if (ship.scored) return;
                    ship.scored = true;
                    if (ship.tag == "pirate") {
                        _this4.game.succeed();
                    } else {
                        _this4.game.fail();
                    }
                };
            }
        }, {
            key: "events",
            value: function events() {
                var _this5 = this;

                var mousedown = false;
                $(window).unbind("keydown");
                $(window).unbind("keyup");
                $(window).bind("keydown", function (ev) {
                    if (ev.keyCode == 32 && !mousedown) {
                        mousedown = true;
                        _this5.buildBullet(_this5.cannon.view.x, _this5.cannon.view.y - 40);
                    }
                });
                $(window).bind("keyup", function () {
                    mousedown = false;
                });
                this.game.stage.addEventListener("mousedown", function () {
                    _this5.buildBullet(_this5.cannon.view.x, _this5.cannon.view.y - 40);
                });
            }
        }, {
            key: "buildBG",
            value: function buildBG() {
                var bg = new createjs.Bitmap(gameResource.getResult("bg"));
                this.view.addChild(bg);
            }
        }, {
            key: "buildCannon",
            value: function buildCannon() {
                this.cannon = new Cannon({ world: this });
                this.view.addChild(this.cannon.view);
            }
        }, {
            key: "buildShip",
            value: function buildShip() {
                this.lastBuildHeightIndex = babyEye.randomRange(0, this.shipHeights.length, this.lastBuildHeightIndex);
                var y = this.shipHeights[this.lastBuildHeightIndex];
                // let xIndex = babyEye.randomRange(0,2);
                var xIndex = 1;
                var x = [-200, this.game.width + 200][xIndex];
                var vx = [5, -5][xIndex];
                var newShip = Math.random() < 0.5 ? this.buildTrader(x, y, vx) : this.buildPirate(x, y, vx);
                if (vx > 0) newShip.view.scaleX *= -1;
                this.view.addChild(newShip.view);
            }
        }, {
            key: "buildTrader",
            value: function buildTrader(x, y, vx) {
                var frames = [[2, 1490, 454, 60], [458, 1428, 454, 60], [2, 1428, 454, 60], [458, 1366, 454, 60], [2, 1366, 454, 60], [458, 1304, 454, 60], [2, 1304, 454, 60], [458, 1242, 454, 60], [2, 1242, 454, 60], [458, 1180, 454, 60], [2, 1180, 454, 60], [458, 1118, 454, 60], [2, 1118, 454, 60], [458, 1056, 454, 60], [2, 1056, 454, 60], [458, 994, 454, 60], [2, 994, 454, 60], [458, 932, 454, 60], [2, 932, 454, 60], [458, 870, 454, 60], [2, 870, 454, 60], [458, 808, 454, 60], [2, 808, 454, 60], [458, 746, 454, 60], [2, 746, 454, 60], [458, 684, 454, 60], [2, 684, 454, 60], [458, 622, 454, 60], [2, 622, 454, 60], [458, 560, 454, 60], [2, 560, 454, 60], [458, 498, 454, 60], [2, 498, 454, 60], [458, 436, 454, 60], [2, 436, 454, 60], [458, 374, 454, 60], [2, 374, 454, 60], [458, 312, 454, 60], [2, 312, 454, 60], [458, 250, 454, 60], [2, 250, 454, 60], [458, 188, 454, 60], [2, 188, 454, 60], [458, 126, 454, 60], [2, 126, 454, 60], [458, 64, 454, 60], [2, 64, 454, 60], [458, 2, 454, 60], [2, 2, 454, 60]];
                var spriteConfig = {
                    initDirection: "br",
                    glasses: this.game.trainInfor.glasses,
                    convergenceDelta: this.game.trainInfor.convergenceDelta,
                    divergenceDelta: this.game.trainInfor.divergenceDelta,
                    speed: 0.1,
                    images: [gameResource.getResult("trader")],
                    frames: frames
                };
                var trader = new Ship({
                    world: this,
                    x: x,
                    y: y,
                    b2Shape: new b2CircleShape(33 * utils.toMeter),
                    b2LinearVelocity: { x: vx, y: 0 },
                    tag: "trader"
                }, spriteConfig);

                return trader;
            }
        }, {
            key: "buildPirate",
            value: function buildPirate(x, y, vx) {
                var frames = [[2, 994, 578, 60], [1162, 932, 578, 60], [582, 932, 578, 60], [2, 932, 578, 60], [1162, 870, 578, 60], [582, 870, 578, 60], [2, 870, 578, 60], [1162, 808, 578, 60], [582, 808, 578, 60], [2, 808, 578, 60], [1162, 746, 578, 60], [582, 746, 578, 60], [2, 746, 578, 60], [1162, 684, 578, 60], [582, 684, 578, 60], [2, 684, 578, 60], [1162, 622, 578, 60], [582, 622, 578, 60], [2, 622, 578, 60], [1162, 560, 578, 60], [582, 560, 578, 60], [2, 560, 578, 60], [1162, 498, 578, 60], [582, 498, 578, 60], [2, 498, 578, 60], [1162, 436, 578, 60], [582, 436, 578, 60], [2, 436, 578, 60], [1162, 374, 578, 60], [582, 374, 578, 60], [2, 374, 578, 60], [1162, 312, 578, 60], [582, 312, 578, 60], [2, 312, 578, 60], [1162, 250, 578, 60], [582, 250, 578, 60], [2, 250, 578, 60], [1162, 188, 578, 60], [582, 188, 578, 60], [2, 188, 578, 60], [1162, 126, 578, 60], [582, 126, 578, 60], [2, 126, 578, 60], [1162, 64, 578, 60], [582, 64, 578, 60], [2, 64, 578, 60], [1162, 2, 578, 60], [582, 2, 578, 60], [2, 2, 578, 60]];

                var b2Shape = new b2PolygonShape();
                var pointArray = [[-55, -30], [-55, 30], [55, 30], [55, -30]];
                pointArray = pointArray.map(function (pos) {
                    return new b2Vec2(pos[0] * utils.toMeter, pos[1] * utils.toMeter);
                });
                b2Shape.SetAsArray(pointArray, 4);

                var spriteConfig = {
                    initDirection: "br",
                    glasses: this.game.trainInfor.glasses,
                    convergenceDelta: this.game.trainInfor.convergenceDelta,
                    divergenceDelta: this.game.trainInfor.divergenceDelta,
                    speed: 0.1,
                    images: [gameResource.getResult("pirate")],
                    frames: frames
                };
                var pirate = new Ship({
                    world: this,
                    x: x,
                    y: y,
                    b2Shape: b2Shape,
                    b2LinearVelocity: { x: vx, y: 0 },
                    tag: "pirate"
                }, spriteConfig);
                return pirate;
            }
        }, {
            key: "buildBullet",
            value: function buildBullet(x, y) {
                createjs.Sound.play("fire", createjs.Sound.INTERRUPT_NONE, 0, 0, 0, 1, 0);
                this.bullet = new Bullet({ world: this, x: x, y: y });
                this.view.addChildAt(this.bullet.view, 1);
            }
        }, {
            key: "buildDebugDraw",
            value: function buildDebugDraw() {
                var debugDraw = new b2DebugDraw();
                debugDraw.SetSprite(document.getElementById("box2d-debug").getContext("2d"));
                debugDraw.SetDrawScale(30.0);
                debugDraw.SetFillAlpha(0.3);
                debugDraw.SetLineThickness(1.0);
                debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
                this.b2world.SetDebugDraw(debugDraw);
            }
        }]);

        return World;
    }();

    var Ship = function (_Base) {
        _inherits(Ship, _Base);

        function Ship(config, spriteConfig) {
            _classCallCheck(this, Ship);

            var _this6 = _possibleConstructorReturn(this, (Ship.__proto__ || Object.getPrototypeOf(Ship)).call(this));

            _this6.config = config;
            _this6.spriteConfig = spriteConfig;
            _this6.world = config.world;
            _this6.game = _this6.world.game;
            _this6.initX = config.x;
            _this6.initY = config.y;
            _this6.tag = config.tag;
            _this6.scored = false;
            _this6.buildView();
            _this6.buildBody();
            return _this6;
        }

        _createClass(Ship, [{
            key: "update",
            value: function update(dt) {
                _get(Ship.prototype.__proto__ || Object.getPrototypeOf(Ship.prototype), "update", this).call(this);
                if (this.view.x > this.world.game.width + 1000 || this.view.x < -1000) {
                    this.world.toRemove.push(this);
                }
            }
        }, {
            key: "buildBody",
            value: function buildBody() {
                var bd = new b2BodyDef();
                bd.type = b2Body.b2_kinematicBody;
                bd.position.x = this.initX * utils.toMeter;
                bd.position.y = this.initY * utils.toMeter;

                var fd = new b2FixtureDef();
                fd.density = utils.fdJson.density;
                fd.friction = utils.fdJson.friction;
                fd.restitution = utils.fdJson.restitution;
                fd.shape = this.config.b2Shape;

                this.body = this.world.b2world.CreateBody(bd);
                this.fixture = this.body.CreateFixture(fd);

                if (this.config.b2LinearVelocity) {
                    this.body.SetLinearVelocity(this.config.b2LinearVelocity);
                }

                this.body.SetUserData(this);
            }
        }, {
            key: "buildView",
            value: function buildView() {
                this.view = new SpriteFU(this.spriteConfig);
            }
        }, {
            key: "destroySelf",
            value: function destroySelf() {
                if (this.view.parent) {
                    this.view.parent.removeChild(this.view);
                    this.view.stop();
                    this.world.b2world.DestroyBody(this.body);
                }
            }
        }]);

        return Ship;
    }(Base);

    var Cannon = function () {
        function Cannon(config) {
            _classCallCheck(this, Cannon);

            this.world = config.world;
            this.game = config.world.game;
            this.vx = 0.1;
            this.buildView();
        }

        _createClass(Cannon, [{
            key: "buildView",
            value: function buildView() {
                this.view = new createjs.Bitmap(gameResource.getResult("cannon"));
                var bounds = this.view.getBounds();
                this.view.set({
                    x: this.game.width / 2,
                    y: this.game.height - bounds.height / 2,
                    regX: bounds.width / 2,
                    regY: bounds.height / 2
                });
            }
        }, {
            key: "update",
            value: function update(dt) {
                this.view.x += this.vx * dt;
                if (this.view.x > this.game.width) {
                    this.view.x = this.game.width;
                    this.vx *= -1;
                } else if (this.view.x < 0) {
                    this.view.x = 0;
                    this.vx *= -1;
                }
            }
        }, {
            key: "destroySelf",
            value: function destroySelf() {
                this.view.parent.removeChild(this.view);
                this.view.stop();
                this.world.b2world.DestroyBody(this.body);
            }
        }]);

        return Cannon;
    }();

    var Bullet = function (_Base2) {
        _inherits(Bullet, _Base2);

        function Bullet(config) {
            _classCallCheck(this, Bullet);

            var _this7 = _possibleConstructorReturn(this, (Bullet.__proto__ || Object.getPrototypeOf(Bullet)).call(this));

            _this7.world = config.world;
            _this7.initX = config.x;
            _this7.initY = config.y;
            _this7.buildView();
            _this7.buildBody();
            return _this7;
        }

        _createClass(Bullet, [{
            key: "update",
            value: function update(dt) {
                _get(Bullet.prototype.__proto__ || Object.getPrototypeOf(Bullet.prototype), "update", this).call(this);
                if (this.view.y < 0) this.world.toRemove.push(this);
            }
        }, {
            key: "buildBody",
            value: function buildBody() {
                var bd = new b2BodyDef();
                bd.type = b2Body.b2_dynamicBody;
                bd.position.x = this.initX * utils.toMeter;
                bd.position.y = this.initY * utils.toMeter;

                var fd = new b2FixtureDef();
                fd.density = utils.fdJson.density;
                fd.friction = utils.fdJson.friction;
                fd.restitution = utils.fdJson.restitution;
                fd.isSensor = true;
                fd.shape = new b2PolygonShape();
                var pointArray = [[-10, -15], [-10, 10], [10, 10], [10, -15]];
                pointArray = pointArray.map(function (pos) {
                    return new b2Vec2(pos[0] * utils.toMeter, pos[1] * utils.toMeter);
                });
                fd.shape.SetAsArray(pointArray, 4);

                this.body = this.world.b2world.CreateBody(bd);
                this.fixture = this.body.CreateFixture(fd);
                this.body.SetLinearVelocity(new b2Vec2(0, -10));
                this.body.SetUserData(this);
            }
        }, {
            key: "buildView",
            value: function buildView() {
                this.view = new createjs.Bitmap(gameResource.getResult("bullet"));
                var bounds = this.view.getBounds();
                this.view.set({
                    regX: bounds.width / 2,
                    regY: bounds.height / 2,
                    scaleX: 0.6,
                    scaleY: 0.6
                });
            }
        }, {
            key: "destroySelf",
            value: function destroySelf() {
                if (!this.view.parent) return;
                this.view.parent.removeChild(this.view);
                this.world.b2world.DestroyBody(this.body);
            }
        }]);

        return Bullet;
    }(Base);

    var Explosion = function Explosion(x, y) {
        _classCallCheck(this, Explosion);

        var img = gameResource.getResult("explosion");
        var data = {
            images: [img],
            frames: { width: 196, height: 190, count: 12, regX: 196 / 2, regY: 190 / 2, spacing: 0, margin: 0 },
            animations: {
                "run": [0, 12, null, 0.2]
            }
        };

        var spriteSheet = new createjs.SpriteSheet(data);
        var sprite = new createjs.Sprite(spriteSheet, "run");
        sprite.set({
            x: x,
            y: y
        });
        setTimeout(function () {
            sprite.stop();
            sprite.parent.removeChild(sprite);
        }, 2000);
        return sprite;
    };

    var SpriteFU = function () {
        function SpriteFU(config) {
            _classCallCheck(this, SpriteFU);

            this.sheetData = {};
            this.sheetData.frames = config.frames;
            this.sheetData.images = config.images;
            this.initDirection = config.initDirection;
            this.glasses = config.glasses;
            this.convergenceDelta = config.convergenceDelta;
            this.divergenceDelta = config.divergenceDelta;
            this.speed = config.speed;
            this.framesCount = this.sheetData.frames.length;
            this.halfCount = Math.floor(this.framesCount / 2);
            this.buildSprite();
            return this.view;
        }

        _createClass(SpriteFU, [{
            key: "buildSprite",
            value: function buildSprite() {
                var allFrames = babyEye.rangeArr(0, this.framesCount);

                var convergenceCount = Math.floor(babyEye.map(this.convergenceDelta, 0, 300, 0, this.halfCount));
                var divergenceCount = Math.floor(babyEye.map(this.divergenceDelta, 0, 300, 0, this.halfCount));

                var divergenceFrames = void 0,
                    convergenceFrames = void 0;
                if (this.glasses != this.initDirection) {
                    divergenceFrames = allFrames.slice(0, divergenceCount);
                    convergenceFrames = allFrames.slice(this.halfCount, this.halfCount + convergenceCount);
                } else {
                    divergenceFrames = allFrames.slice(0, convergenceCount);
                    convergenceFrames = allFrames.slice(this.halfCount, this.halfCount + divergenceCount);
                }

                this.sheetData.animations = {
                    "divergence": {
                        frames: divergenceFrames,
                        speed: this.speed,
                        next: "divergenceReverse"
                    },
                    "divergenceReverse": {
                        frames: babyEye.reversed(divergenceFrames),
                        speed: this.speed,
                        next: "convergence"
                    },

                    "convergence": {
                        frames: convergenceFrames,
                        speed: this.speed,
                        next: "convergenceReverse"
                    },

                    "convergenceReverse": {
                        frames: babyEye.reversed(convergenceFrames),
                        speed: this.speed,
                        next: "divergence"
                    }
                };
                var spriteSheet = new createjs.SpriteSheet(this.sheetData);
                this.view = new createjs.Sprite(spriteSheet, "divergence");
                var bounds = this.view.getBounds();
                this.view.set({
                    regX: bounds.width / 2,
                    regY: bounds.height / 2
                });
            }
        }]);

        return SpriteFU;
    }();
});