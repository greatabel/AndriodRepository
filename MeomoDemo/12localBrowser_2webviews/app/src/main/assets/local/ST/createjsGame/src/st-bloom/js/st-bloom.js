"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(window).ready(function () {
    var prepareConfig = {
        instruction: "光芒绽放，注视训练场景內中心位置，可以引导孩子想像自己正在进入时空隧道，中心将出现水果，有固定在中心的目标水果，有向四周扩散的水果。点击与中心水果相同的水果将增加所积攒的积攒水果数量。看看你能积攒多少水果吧！",
        staticPath: "../../../static/", //该训练的html相对于static文件夹的路径
        callback: function callback(trainInfor) {
            // 完成选择后的回调函数，将开始训练放在其中，trainInfor是患者选择的结果
            //trainInfor.glasses为"rb"或"br"
            //trainInfor.difficulty为难度easy hard medium
            //targetInfor里面有color和filter，是脱抑制的目标颜色信息。打印看看
            console.log(trainInfor);
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
    //             targetInfor:{color: "red", filter: new createjs.ColorFilter(1,0,0,1,255,0,0,0)}
    //         }
    //         init(trainInfor);//选择完成后，开始训练函数
    //     }
    // }

    // babyEye.prepareTrain(prepareConfig);
    //end for develop------------------------------------

    var log = console.log;
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
            key: "buildBG",
            value: function buildBG() {
                var config = {
                    colors: ["#FF0000", "#00FF00", "#0000FF", "#FF7E00", "#EA00FF", "#00FFFF"],
                    time: 300,
                    canvasID: "bg-canvas"
                };
                if (window.bloomBG) window.bloomBG.removeSelf();
                window.bloomBG = new BloomBG(config);
            }
        }, {
            key: "loadResource",
            value: function loadResource() {
                var _this = this;

                $("#loading").show();
                //训练资源第一次，唯一一次赋值
                gameResource = new createjs.LoadQueue();
                gameResource.installPlugin(createjs.Sound);

                //添加加载事件
                gameResource.addEventListener("complete", function (ev) {
                    $("#loading").hide();
                    _this.onLoadingComplete();
                });

                //加载资源路径
                window.fruitsID = ["apple", "cherry", "grape", "lemon", "orange", "pear", "pineapple"];

                var loadArr = [];
                loadArr.push({ id: "mBG", src: "../../../static/music/bg/s26.mp3" }, { id: "wonderful", src: "../../../static/music/wonderful.mp3" }, { id: "click", src: "../../../static/music/click/1.mp3" }, { id: "numBG", src: "../src/st-bloom/img/num.png" });
                window.fruitsID.forEach(function (fruitID) {
                    loadArr.push({ id: fruitID, src: "../src/st-bloom/img/" + fruitID + ".png" });
                });

                //加载
                gameResource.loadManifest(loadArr);
            }
        }, {
            key: "onLoadingComplete",
            value: function onLoadingComplete() {
                this.buildBG();
                this.stage.removeAllChildren();
                this.buildScore();
                this.buildWorld(); //产生训练场景
                this.buildButtons(); //产生训练按钮
                this.render();
                createjs.Sound.play("mBG", createjs.Sound.INTERRUPT_NONE, 0, 0, -1, 0.5, 0);
            }
        }, {
            key: "buildWorld",
            value: function buildWorld() {
                if (this.world) this.stage.removeChild(this.world.view);
                this.world = new World(this);
                this.stage.addChildAt(this.world, 1);
            }
        }, {
            key: "buildScore",
            value: function buildScore() {
                this.score = new babyEye.Score();
                this.stage.addChild(this.score.view);
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
                var _this4 = this;

                if (!this.successBitmap) {
                    var img = gameResource.getResult("success");
                    this.successBitmap = new createjs.Bitmap(img);
                    this.successBitmap.set({
                        x: this.width / 2,
                        y: this.height / 2,
                        regX: img.width / 2,
                        regY: img.height / 2,
                        scaleX: 1.5,
                        scaleY: 1.5
                    });
                    this.stage.addChild(this.successBitmap);
                }

                this.successBitmap.visible = true;

                setTimeout(function () {
                    _this4.successBitmap.visible = false;
                }, 1500);
            }
        }, {
            key: "fail",
            value: function fail() {
                var _this5 = this;

                this.stage.addChild(babyEye.failBitmap);
                setTimeout(function () {
                    _this5.stage.removeChild(babyEye.failBitmap);
                }, 1000);
            }
        }, {
            key: "replay",
            value: function replay() {
                $(window).unbind(); //解绑事件
                this.stage.removeAllChildren();
                this.stage.removeAllEventListeners();
                this.pause();
                createjs.Sound.stop();
                babyEye.prepareTrain(prepareConfig);
            }
        }, {
            key: "changeLevel",
            value: function changeLevel(value) {
                if (value > 0) {
                    this.succeed();
                    createjs.Sound.play("wonderful", createjs.Sound.INTERRUPT_NONE, 0, 0, 0, 1, 0);
                } else {
                    this.fail();
                    createjs.Sound.play("wrong", createjs.Sound.INTERRUPT_NONE, 0, 0, 0, 1, 0);
                }

                this.score.changeValue(value);
                if (this.score.value <= 1) this.score.setValue(1);
                this.buildWorld();
            }
        }]);

        return Game;
    }();

    var World = function (_createjs$Container) {
        _inherits(World, _createjs$Container);

        function World(game) {
            _classCallCheck(this, World);

            var _this6 = _possibleConstructorReturn(this, (World.__proto__ || Object.getPrototypeOf(World)).call(this));

            _this6.game = game;
            _this6.lastFrame = 0;
            _this6.runningTime = 0;
            _this6.lastTargetTime = 0;
            _this6.lastFruitTime = 0;
            _this6.fruits = [];
            _this6.toRemove = [];
            _this6.targetScale = 0.5;
            _this6.beginFruit = false;
            setTimeout(function () {
                _this6.beginFruit = true;
                _this6.buildTarget();
            }, 3000);
            return _this6;
        }

        _createClass(World, [{
            key: "buildTarget",
            value: function buildTarget() {
                if (this.target) this.removeChild(this.target);
                this.fruitIndex = babyEye.randomExcept(0, window.fruitsID.length, this.fruitIndex ? this.fruitIndex : 0);
                this.target = new Fruit(this, {
                    fruitID: window.fruitsID[this.fruitIndex],
                    isTarget: true,
                    scale: this.targetScale
                });
                this.addChild(this.target);
                this.target.set({
                    x: this.game.width / 2,
                    y: this.game.height / 2
                });

                if (this.targetScale > 0.2) {
                    this.targetScale -= 0.05;
                }
            }
        }, {
            key: "buildFruit",
            value: function buildFruit() {
                var fruit = new Fruit(this, {
                    fruitID: window.fruitsID[babyEye.randomRange(0, window.fruitsID.length)]
                });
                fruit.set({
                    x: this.game.width / 2,
                    y: this.game.height / 2
                });

                this.fruits.push(fruit);
                this.addChild(fruit);
            }
        }, {
            key: "update",
            value: function update(dt) {
                this.fruits.forEach(function (fruit) {
                    fruit.update(dt);
                });

                this.toRemove.forEach(function (item) {
                    item.removeSelf();
                });

                if (this.beginFruit) {
                    if (this.runningTime - this.lastTargetTime > 20000) {
                        this.buildTarget();
                        this.lastTargetTime = this.runningTime;
                    }

                    if (this.runningTime - this.lastFruitTime > 500) {
                        this.buildFruit();
                        this.lastFruitTime = this.runningTime;
                    }
                }

                this.runningTime += dt;
            }
        }]);

        return World;
    }(createjs.Container);

    var Fruit = function (_createjs$Container2) {
        _inherits(Fruit, _createjs$Container2);

        function Fruit(world, infor) {
            _classCallCheck(this, Fruit);

            var _this7 = _possibleConstructorReturn(this, (Fruit.__proto__ || Object.getPrototypeOf(Fruit)).call(this));

            _this7.world = world;
            _this7.infor = infor;
            _this7.angle = -Math.PI + Math.PI * Math.random() * 2;
            _this7.v = 2;
            _this7.buildContent();
            if (!infor.isTarget) _this7.events();
            return _this7;
        }

        _createClass(Fruit, [{
            key: "events",
            value: function events() {
                var _this8 = this;

                this.addEventListener("mousedown", function (ev) {
                    if (_this8.world.target.infor.fruitID == _this8.infor.fruitID) {
                        _this8.removeSelf();
                        _this8.world.game.score.changeValue(1);
                    }
                });
            }
        }, {
            key: "buildContent",
            value: function buildContent() {
                this.content = new createjs.Bitmap(gameResource.getResult(this.infor.fruitID));
                this.set({
                    regX: this.content.image.width / 2,
                    regY: this.content.image.height / 2,
                    scaleX: this.infor.scale ? this.infor.scale : 0.5,
                    scaleY: this.infor.scale ? this.infor.scale : 0.5
                });

                this.content.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("black").drawRect(0, 0, this.content.image.width, this.content.image.height));

                this.addChild(this.content);
            }
        }, {
            key: "update",
            value: function update(dt) {
                if (this.scaleX < 1) {
                    this.scaleY = this.scaleX += dt * 0.0001;
                }
                this.x += this.v * Math.cos(this.angle);
                this.y += this.v * Math.sin(this.angle);

                if (this.x > this.world.game.width + 100 || this.x < -100 || this.y > this.world.game.height + 100 || this.y < -100) {
                    this.world.toRemove.push(this);
                }
            }
        }, {
            key: "removeSelf",
            value: function removeSelf() {
                var index = this.world.fruits.indexOf(this);
                if (index === -1) return;
                this.world.fruits.splice(index, 1);
                this.world.removeChild(this);
            }
        }]);

        return Fruit;
    }(createjs.Container);
});