"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(window).ready(function () {
    var prepareConfig = {
        instruction: "训练场景內有很多小E字标，这些小的E字标组成了一个凸起的大E字标，观察出大的凸起的E字标开口方向，按键盘的上下左右键选择开口方向，或者点击屏幕上的方向按钮。",
        selectGlasses: true, //是否需要选择眼镜
        selectLazyEye: false, //是否需要选择差眼，如果该项为true，则必须让selectGlasses也为true，因为需要眼镜信息来计算目标的正确颜色。脱抑制用。
        selectDifficulty: false, //是否需要选择难度
        staticPath: "../../static/", //该训练的html相对于static文件夹的路径
        callback: function callback(trainInfor) {
            // 完成选择后的回调函数，将开始训练放在其中，trainInfor是患者选择的结果
            //trainInfor.glasses为"rb"或"br"
            //trainInfor.difficulty为难度easy hard medium
            //targetInfor里面有color和filter，是脱抑制的目标颜色信息。打印看看
            console.log(trainInfor);
            window.trainInfor = trainInfor;
            init(trainInfor); //选择完成后，开始训练函数
        }
    };

    babyEye.prepareTrain(prepareConfig); //选择训练参数和说明展示

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
            this.directionIndex = babyEye.randomRange(0, 4);
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
                gameResource.installPlugin(createjs.Sound);

                //添加加载事件
                gameResource.addEventListener("complete", function (ev) {
                    $("#loading").hide();
                    _this.onLoadingComplete();
                });

                //加载资源路径
                var loadArr = [{ id: "mBG", src: "../../static/music/bg/s21.mp3" }, { id: "wonderful", src: "../../static/music/wonderful.mp3" }, { id: "e-up", src: "../src/ste-identify-direction/img/e-up.png" }, { id: "e-down", src: "../src/ste-identify-direction/img/e-down.png" }, { id: "e-right", src: "../src/ste-identify-direction/img/e-right.png" }, { id: "e-left", src: "../src/ste-identify-direction/img/e-left.png" }, { id: "up", src: "../src/ste-identify-direction/img/up.png" }, { id: "down", src: "../src/ste-identify-direction/img/down.png" }, { id: "right", src: "../src/ste-identify-direction/img/right.png" }, { id: "left", src: "../src/ste-identify-direction/img/left.png" }, { id: "bg", src: "../src/ste-identify-direction/img/bg.png" }, { id: "level", src: "../src/ste-identify-direction/img/level.png" }, { id: "preface", src: "../src/ste-identify-direction/img/preface.png" }, { id: "start-red", src: "../src/ste-identify-direction/img/start-red.png" }, { id: "start-green", src: "../src/ste-identify-direction/img/start-green.png" }];

                //加载
                gameResource.loadManifest(loadArr);
            }
        }, {
            key: "onLoadingComplete",
            value: function onLoadingComplete() {
                this.stage.removeAllChildren();
                this.buildLevel();
                this.buildWorld(); //产生训练场景
                this.buildButtons(); //产生训练按钮
                this.render();
                createjs.Sound.play("mBG", createjs.Sound.INTERRUPT_NONE, 0, 0, -1, 0.5, 0);
            }
        }, {
            key: "buildWorld",
            value: function buildWorld() {
                if (this.world) this.stage.removeChild(this.world);
                this.world = new World(this);
                this.stage.addChildAt(this.world, 0);
            }
        }, {
            key: "buildLevel",
            value: function buildLevel() {
                this.level = new babyEye.Level(0, 0);
                this.stage.addChild(this.level.view);
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
                createjs.Sound.play("wonderful", createjs.Sound.INTERRUPT_NONE, 0, 0, 0, 1, 0);
                this.stage.addChild(babyEye.successBitmap);
                babyEye.successBitmap.visible = true;
                setTimeout(function () {
                    babyEye.successBitmap.visible = false;
                }, 1500);
                this.level.changeValue(1);
                this.updateLevel();
            }
        }, {
            key: "fail",
            value: function fail() {
                var _this4 = this;

                this.stage.addChild(babyEye.failBitmap);
                setTimeout(function () {
                    _this4.stage.removeChild(babyEye.failBitmap);
                }, 1000);
                this.level.changeValue(-1);
                this.updateLevel();
            }
        }, {
            key: "updateLevel",
            value: function updateLevel() {
                this.buildWorld();
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
        }]);

        return Game;
    }();

    var World = function (_createjs$Container) {
        _inherits(World, _createjs$Container);

        function World(game) {
            _classCallCheck(this, World);

            var _this5 = _possibleConstructorReturn(this, (World.__proto__ || Object.getPrototypeOf(World)).call(this));

            _this5.game = game;
            _this5.lastFrame = 0;
            _this5.runningTime = 0;
            _this5.deltaX = 30 - _this5.game.level.value;
            if (_this5.deltaX < 6) _this5.deltaX = 6;
            _this5.buildBG();
            _this5.buildEs();
            _this5.buildButtons();
            _this5.events();
            return _this5;
        }

        _createClass(World, [{
            key: "buildBG",
            value: function buildBG() {
                this.bg = new createjs.Bitmap(gameResource.getResult("bg"));
                this.addChild(this.bg);
            }
        }, {
            key: "buildButtons",
            value: function buildButtons() {
                var _this6 = this;

                this.buttons = new DirectionButton(function (direction) {
                    _this6.judge(direction);
                });
                this.addChild(this.buttons);
                this.buttons.set({
                    x: this.game.width - 200,
                    y: this.game.height - 350,
                    scaleX: 1.5,
                    scaleY: 1.5,
                    compositeOperation: "source-over"
                });
            }
        }, {
            key: "buildEs",
            value: function buildEs() {
                var _this7 = this;

                this.eContainer = new createjs.Container();
                this.eContainer.compositeOperation = 'darken';
                var images = [];
                var directions = "up,down,left,right".split(",");
                directions.forEach(function (direction) {
                    images.push(gameResource.getResult("e-" + direction));
                });

                this.game.directionIndex = babyEye.randomExcept(0, 4, this.game.directionIndex);

                this.direction = directions[this.game.directionIndex]; //凸起方向

                var map = window.directionMap[this.direction];
                var convexBitmaps = images.map(function (image) {
                    return new E(image, _this7.deltaX, "convex");
                });

                var sunkenBitmaps = images.map(function (image) {
                    return new E(image, _this7.deltaX, "sunken");
                });

                for (var row = 0; row < 5; row++) {
                    for (var col = 0; col < 5; col++) {
                        var e = void 0;
                        if (map[row][col]) {
                            e = convexBitmaps[babyEye.randomRange(0, 4)].clone(true);
                        } else {
                            e = sunkenBitmaps[babyEye.randomRange(0, 4)].clone(true);
                        }

                        e.set({
                            x: col * 150,
                            y: row * 150
                        });

                        this.eContainer.addChild(e);
                    }
                }

                this.eContainer.set({
                    x: this.game.width / 2 - 100,
                    y: this.game.height / 2,
                    regX: 710 / 2,
                    regY: 700 / 2,
                    scaleX: 0.6,
                    scaleY: 0.6
                });

                this.addChild(this.eContainer);
            }
        }, {
            key: "events",
            value: function events() {
                var _this8 = this;

                var keyMap = {
                    "37": "left",
                    "38": "up",
                    "39": "right",
                    "40": "down"
                };
                $(window).unbind("keydown");
                $(window).bind("keydown", function (ev) {
                    if (ev.keyCode >= 37 && ev.keyCode <= 40) {
                        _this8.judge(keyMap[ev.keyCode]);
                    }
                });
            }
        }, {
            key: "judge",
            value: function judge(direction) {
                if (direction == this.direction) {
                    this.game.succeed();
                } else {
                    this.game.fail();
                }
            }
        }, {
            key: "update",
            value: function update(deltaTime) {
                this.runningTime += deltaTime;
            }
        }]);

        return World;
    }(createjs.Container);

    var E = function (_createjs$Container2) {
        _inherits(E, _createjs$Container2);

        function E(image, delta, type) {
            _classCallCheck(this, E);

            var _this9 = _possibleConstructorReturn(this, (E.__proto__ || Object.getPrototypeOf(E)).call(this));

            var leftImg = void 0,
                rightImg = void 0;
            if (type == "convex") {
                leftImg = new babyEye.FilteredImg(image, [trainInfor.glasses == 'br' ? babyEye.blueFilter : babyEye.redFilter]);
                rightImg = new babyEye.FilteredImg(image, [trainInfor.glasses == 'br' ? babyEye.redFilter : babyEye.blueFilter]);
            } else if (type == "sunken") {
                leftImg = new babyEye.FilteredImg(image, [babyEye.redFilter]);
                rightImg = new babyEye.FilteredImg(image, [babyEye.blueFilter]);
                delta = 0;
            }

            var bitmapLeft = new createjs.Bitmap(leftImg);
            var bitmapRight = new createjs.Bitmap(rightImg);

            bitmapLeft.x = -delta / 2;
            bitmapRight.x = delta / 2;

            _this9.addChild(bitmapLeft, bitmapRight);
            return _this9;
        }

        return E;
    }(createjs.Container);

    var DirectionButton = function (_createjs$Container3) {
        _inherits(DirectionButton, _createjs$Container3);

        function DirectionButton(callback) {
            _classCallCheck(this, DirectionButton);

            var _this10 = _possibleConstructorReturn(this, (DirectionButton.__proto__ || Object.getPrototypeOf(DirectionButton)).call(this));

            _this10.callback = callback;
            _this10.buildContent();
            return _this10;
        }

        _createClass(DirectionButton, [{
            key: "buildContent",
            value: function buildContent() {
                var _this11 = this;

                var directions = "up,left,down,right".split(",");
                directions.forEach(function (direction, index) {
                    var button = new createjs.Bitmap(gameResource.getResult(direction));
                    _this11.addChild(button);
                    button.addEventListener("mousedown", function () {
                        _this11.callback(direction);
                    });
                    _this11[direction + "Button"] = button;
                });

                this.upButton.set({
                    x: 0,
                    y: -48
                });

                this.downButton.set({
                    x: 0,
                    y: 48
                });

                this.leftButton.set({
                    x: -48,
                    y: 0
                });

                this.rightButton.set({
                    x: 48,
                    y: 0
                });
            }
        }]);

        return DirectionButton;
    }(createjs.Container);
});