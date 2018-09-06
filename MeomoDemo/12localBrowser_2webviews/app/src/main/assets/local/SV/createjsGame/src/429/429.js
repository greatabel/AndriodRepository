"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(window).ready(function () {
    var prepareConfig = {
        selectGlasses: true, //是否需要选择眼镜
        // selectFuseType: true,//是否有融合模式选择
        //以上属性，均为可选，没有该属性默认false或其他默认值！！！！！！！！！！
        instruction: "请用鼠标或者手指把红色的十字图形移动到蓝色的交叉图形的最中间位置，点击一下即可，移动端通过滑动控制十字图形，抬起手指即为确定。",
        staticPath: "../../../static/", //该训练的html相对于static文件夹的路径
        // background: "pink-grid",
        callback: function callback(trainInfor) {
            // 完成选择后的回调函数，将开始训练放在其中，trainInfor是患者选择的结果
            //trainInfor.glasses为"rb"|"br"
            window.filters = [babyEye.redFilter, babyEye.blueFilter];
            if (trainInfor.glasses == 'rb') {
                window.filters.reverse();
            }
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

    //开始训练函数
    function init(trainInfor) {
        window.game = new Game(trainInfor);
        window.log = console.log;
    }
    //声明训练资源
    var gameResource = null;

    var Game = function () {
        function Game(trainInfor) {
            _classCallCheck(this, Game);

            this.trainInfor = trainInfor;
            this.stage = new createjs.Stage("game-canvas");
            this.stage.enableMouseOver();
            this.stage.cursor = "none";
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
                var loadArr = [];
                loadArr.push({ id: "wonderful", src: "../../../static/music/wonderful.mp3" }, { id: "click", src: "../../../static/music/click.mp3" }, { id: "mBG", src: "../../../static/music/3.mp3" }, { id: "gun", src: "../src/429/gun.png" }, { id: "target", src: "../src/429/target.png" }, { id: "bg", src: "../src/429/gratings.png" });

                //加载
                gameResource.loadManifest(loadArr);
            }
        }, {
            key: "onLoadingComplete",
            value: function onLoadingComplete() {
                this.beginTrain();
            }
        }, {
            key: "beginTrain",
            value: function beginTrain() {
                this.stage.removeAllChildren();
                this.buildWorld(); //产生训练场景
                this.buildButtons(); //产生训练按钮
                this.buildLevel(); //产生得分类
                this.buildBG();
                this.render();
                createjs.Sound.play("mBG", createjs.Sound.INTERRUPT_NONE, 0, 0, -1, 0.5, 0);
            }
        }, {
            key: "buildBG",
            value: function buildBG() {
                this.bg = new createjs.Shape();
                this.bg.graphics.f('#ff00ff').dr(0, 0, this.width, this.height);
                this.stage.addChildAt(this.bg, 0);
            }
        }, {
            key: "buildWorld",
            value: function buildWorld() {
                this.world = new World(this);
                this.stage.addChildAt(this.world, 0);
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
            key: "buildLevel",
            value: function buildLevel() {
                this.level = new babyEye.Level(1, 1); //还有当前关数类，是babyEye.Level,用法完全一样，只是背景文字不同。
                // this.level.view.x -= 210;
                this.stage.addChild(this.level.view);
            }
        }, {
            key: "buildCountDown",
            value: function buildCountDown() {
                var _this3 = this;

                if (this.countDown) this.stage.removeChild(this.countDown.view);
                var config = {
                    duration: 300 * 1000, //倒计时时间
                    callback: function callback() {
                        //倒计时为0时候的回调函数
                        _this3.end();
                    }
                };

                this.countDown = new babyEye.CountDown(config);
                this.stage.addChild(this.countDown.view);
            }
        }, {
            key: "render",
            value: function render() {
                var _this4 = this;

                var timestamp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

                if (this.pauseValue) return;
                if (this.endValue) return;

                var dt = timestamp - this.lastFrame;
                if (dt > 150 || dt < 0) dt = 0;
                this.lastFrame = timestamp;

                // this.world.update(dt);
                this.stage.update();

                requestAnimationFrame(function (timestamp) {
                    _this4.render(timestamp);
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
                var _this5 = this;

                this.stage.addChild(babyEye.successBitmap);
                setTimeout(function () {
                    _this5.stage.removeChild(babyEye.successBitmap);
                }, 1000);
                this.level.changeValue(1);
                createjs.Sound.play("wonderful", createjs.Sound.INTERRUPT_NONE, 0, 0, 0, 1, 0);
            }
        }, {
            key: "fail",
            value: function fail() {
                this.level.changeValue(-1);
                createjs.Sound.play("click", createjs.Sound.INTERRUPT_NONE, 0, 0, 0, 1, 0);
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

    var World = function (_createjs$Container) {
        _inherits(World, _createjs$Container);

        function World(game) {
            _classCallCheck(this, World);

            var _this6 = _possibleConstructorReturn(this, (World.__proto__ || Object.getPrototypeOf(World)).call(this));

            _this6.game = game;
            _this6.runningTime = 0;

            _this6.bgObj = new BG(_this6.game);
            _this6.gun = new Gun(_this6.game);
            _this6.target = new Target(_this6.game);

            _this6.addChild(_this6.bgObj, _this6.target, _this6.gun);
            _this6.addEvents();
            return _this6;
        }

        _createClass(World, [{
            key: "addEvents",
            value: function addEvents() {
                var _this7 = this;

                this.game.stage.removeAllEventListeners();
                var oldPt = { x: 0, y: 0 };
                var oldGun = { x: 0, y: 0 };
                var mousedown = false;
                this.game.stage.addEventListener("stagemousemove", function (ev) {
                    if (!mousedown) {
                        _this7.gun.x = _this7.game.stage.mouseX;
                        _this7.gun.y = _this7.game.stage.mouseY;
                    }
                });

                this.game.stage.addEventListener("stagemouseup", function (ev) {
                    mousedown = false;
                    createjs.Sound.play("click", createjs.Sound.INTERRUPT_NONE, 0, 0, 0, .5, 0);
                    var distance = babyEye.distance(_this7.gun.x, _this7.gun.y, _this7.target.x, _this7.target.y);
                    _this7.judge(distance);
                });

                this.game.stage.addEventListener("stagemousedown", function (ev) {
                    mousedown = true;
                    var _ref = [ev.stageX, ev.stageY];
                    oldPt.x = _ref[0];
                    oldPt.y = _ref[1];
                    var _ref2 = [_this7.gun.x, _this7.gun.y];
                    oldGun.x = _ref2[0];
                    oldGun.y = _ref2[1];
                });

                this.game.stage.addEventListener("pressmove", function (ev) {
                    _this7.gun.x = oldGun.x + ev.stageX - oldPt.x;
                    _this7.gun.y = oldGun.y + ev.stageY - oldPt.y;
                });
            }
        }, {
            key: "judge",
            value: function judge(distance) {
                var thresholed = 9;
                if (this.game.level.value > 2) {
                    thresholed = 8;
                }
                if (this.game.level.value > 4) {
                    thresholed = 7;
                }

                if (this.game.level.value > 6) {
                    thresholed = 6;
                }

                if (this.game.level.value > 8) {
                    thresholed = 5;
                }

                if (distance < thresholed) {
                    this.game.succeed();
                } else {
                    this.game.fail();
                }

                this.updateObjects();
            }
        }, {
            key: "updateObjects",
            value: function updateObjects() {
                this.target.set({
                    x: babyEye.randomRange(250, this.game.width - 250),
                    y: babyEye.randomRange(250, this.game.height - 250),
                    scaleX: this.game.level.value < 5 ? (11 - this.game.level.value) / 10 : 0.5,
                    scaleY: this.game.level.value < 5 ? (11 - this.game.level.value) / 10 : 0.5
                });

                this.gun.set({
                    scaleX: this.game.level.value < 5 ? (11 - this.game.level.value) / 10 : 0.5,
                    scaleY: this.game.level.value < 5 ? (11 - this.game.level.value) / 10 : 0.5
                });
            }
        }]);

        return World;
    }(createjs.Container);

    var BG = function (_c$Container) {
        _inherits(BG, _c$Container);

        function BG(game) {
            _classCallCheck(this, BG);

            // new babyEye.babyEye.ImageFiltered(originalImg, [this.game.trainInfor.targetInfor.filter])
            var _this8 = _possibleConstructorReturn(this, (BG.__proto__ || Object.getPrototypeOf(BG)).call(this));

            _this8.game = game;
            var originalImg = gameResource.getResult("bg");
            var spriteObj = {
                "images": [new babyEye.ImageFiltered(originalImg, [new createjs.ColorFilter(1, 0, 1, 1, 0, 0, 0)])],
                "frames": [[91, 358, 87, 87], [91, 269, 87, 87], [2, 358, 87, 87], [2, 269, 87, 87], [91, 180, 87, 87], [2, 180, 87, 87], [91, 91, 87, 87], [2, 91, 87, 87], [91, 2, 87, 87], [2, 2, 87, 87]],
                "animations": {
                    run: [0, 9, "run", 0.5]
                }
            };

            var spriteSheet = new c.SpriteSheet(spriteObj);
            var sprite = new c.Sprite(spriteSheet, "run");
            _this8.blueCircle = new c.Shape(new c.Graphics().beginFill("rgb(128,0,255)").drawCircle(43, 44, 39));
            _this8.redCircle = new c.Shape(new c.Graphics().beginFill("rgb(255,0,128)").drawCircle(43, 44, 39));
            _this8.addChild(_this8.blueCircle, _this8.redCircle, sprite);

            var bounds = _this8.getBounds();
            _this8.set({
                x: _this8.game.width / 2,
                y: _this8.game.height / 2,
                regX: bounds.width / 2,
                regY: bounds.height / 2,
                scaleX: 10,
                scaleY: 8
            });

            _this8.changeDirection();
            _this8.changeColor();
            return _this8;
        }

        _createClass(BG, [{
            key: "changeDirection",
            value: function changeDirection() {
                var _this9 = this;

                this.scaleX *= -1;
                setTimeout(function () {
                    _this9.changeDirection();
                }, 3000);
            }
        }, {
            key: "changeColor",
            value: function changeColor() {
                var _this10 = this;

                this.redCircle.visible = !this.redCircle.visible;
                setTimeout(function () {
                    _this10.changeColor();
                }, 6000);
            }
        }]);

        return BG;
    }(c.Container);

    var Gun = function (_c$Container2) {
        _inherits(Gun, _c$Container2);

        function Gun(game) {
            _classCallCheck(this, Gun);

            var _this11 = _possibleConstructorReturn(this, (Gun.__proto__ || Object.getPrototypeOf(Gun)).call(this));

            _this11.game = game;
            _this11.addGun();
            var bounds = { x: 0, y: 0, width: 67.89, height: 67.89 };
            _this11.set({
                x: babyEye.randomRange(bounds.width / 2, _this11.game.width - bounds.width / 2),
                y: babyEye.randomRange(bounds.height / 2, _this11.game.height - bounds.height / 2),
                regX: bounds.width / 2,
                regY: bounds.height / 2
            });

            _this11.flicker();
            _this11.compositeOperation = "darken";
            return _this11;
        }

        _createClass(Gun, [{
            key: "addGun",
            value: function addGun() {
                var originalImg = new babyEye.ImageFiltered(gameResource.getResult("gun"), [window.filters[1]]);
                var gun = new createjs.Bitmap(originalImg);
                gun.set({
                    scaleX: 0.7,
                    scaleY: 0.7
                });
                this.addChild(gun);
            }
        }, {
            key: "flicker",
            value: function flicker() {
                var _this12 = this;

                this.visible = !this.visible;
                setTimeout(function () {
                    _this12.flicker();
                }, 100);
            }
        }]);

        return Gun;
    }(c.Container);

    var Target = function (_c$Container3) {
        _inherits(Target, _c$Container3);

        function Target(game) {
            _classCallCheck(this, Target);

            var _this13 = _possibleConstructorReturn(this, (Target.__proto__ || Object.getPrototypeOf(Target)).call(this));

            _this13.game = game;
            _this13.addTarget();
            _this13.flicker();
            return _this13;
        }

        _createClass(Target, [{
            key: "addTarget",
            value: function addTarget() {
                var originalImg = gameResource.getResult("target");
                var filteredImg = new babyEye.ImageFiltered(gameResource.getResult("target"), [window.filters[0]]);

                var targetCross = new createjs.Bitmap(filteredImg);
                targetCross.set({
                    regX: originalImg.width / 2,
                    regY: originalImg.height / 2,
                    x: 0,
                    y: 0,
                    scaleX: 0.6,
                    scaleY: 0.6
                });

                this.addChild(targetCross);
                this.compositeOperation = "darken";

                this.set({
                    x: babyEye.randomRange(originalImg.width / 2, this.game.width - originalImg.width / 2),
                    y: babyEye.randomRange(originalImg.height / 2, this.game.height - originalImg.height / 2)
                });
            }
        }, {
            key: "flicker",
            value: function flicker() {
                var _this14 = this;

                this.visible = !this.visible;
                setTimeout(function () {
                    _this14.flicker();
                }, 100);
            }
        }]);

        return Target;
    }(c.Container);
});