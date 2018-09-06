"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(window).ready(function () {
    var prepareConfig = {
        //instruction: (window.ipad?"本训练是同时视训练，请每日交替使用红蓝、蓝红眼镜。手指拖动小羊，黄羊赶到绿色羊圈，绿羊赶到黄色羊圈。羊圈上方为正确的小羊数量。":"本训练是同时视训练，请每日交替使用红蓝、蓝红眼镜。训练的任务是让青蛙踩在色块上面跳过河，千万不要掉到河里面去了。请用键盘的上下键来控制青蛙的前后跳动。"),
        instruction: babyEye.isMobile() ? "本训练为脱抑制训练，请每日交替使用红蓝、蓝红眼镜并选择视力较差的眼睛。手指在屏幕上移动时夹子会跟着移动。在夹子靠近虫子时，松开手指，就能抓住它。抓住后请继续移动夹子，把虫子放到聪头的背篓中。小心虫子爬到苹果上20秒内会吃掉苹果呦！" : "本训练为脱抑制训练，请每日交替使用红蓝、蓝红眼镜并选择视力较差的眼睛。用鼠标左键点击爬动的虫子，按住鼠标拖到聪头的背篓中即可。小心虫子爬到苹果上20秒内会吃掉苹果呦！",
        selectGlasses: true, //是否需要选择眼镜
        selectLazyEye: true, //是否需要选择差眼，如果该项为true，则必须让selectGlasses也为true，因为需要眼镜信息来计算目标的正确颜色。脱抑制用。
        selectDifficulty: false, //是否需要选择难度
        selectVergenceType: false,
        staticPath: "../../static/", //该训练的html相对于static文件夹的路径
        language: "zh",
        background: "pink-grid",
        testForFU: false,
        callback: function callback(trainInfor) {
            // 完成选择后的回调函数，将开始训练放在其中，trainInfor是患者选择的结果
            //trainInfor.glasses为"rb"或"br"
            //trainInfor.difficulty为难度easy hard medium
            //targetInfor里面有color和filter，是脱抑制的目标颜色信息。打印看看

            init(trainInfor); //选择完成后，开始训练函数
        }
    };

    babyEye.prepareTrain(prepareConfig); //选择训练参数和说明展示

    //开始训练函数
    function init(trainInfor) {
        window.game = new Game(trainInfor);
        if(babyEye.isMobile()) babyEye.rotateTrain(game.stage);
    }

    //声明训练资源
    var gameResource = null;
    var APPLE = [[680, 251.15], [890, 358.3], [840, 150], [460, 358.3], [600, 74.4], [660, 439.45], [403.2, 160]];

    var Game = function () {
        function Game(trainInfor) {
            _classCallCheck(this, Game);

            this.trainInfor = trainInfor;
            this.stage = new c.Stage("game-canvas");
            createjs.Touch.enable(this.stage);
            this.stage.enableMouseOver();
            this.width = this.stage.canvas.width;
            this.height = this.stage.canvas.height;

            if (gameResource) {
                //如果已加载，不再重复加载
                this.onLoadingComplete();
            } else {
                this.loadResource();
            }
            this.lastPlay = 0;
            this.time = 0;
            this.level = 1;
            this.running = false;
            this.shinning = this.trainInfor.glasses[this.trainInfor.lazyEye];
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
                gameResource.addEventListener("error", function (ev) {
                    $("#loading").hide();
                    var loadingText = new createjs.Text("0%", "24px Arial", "black");
                    loadingText.set({ x: _this.width / 2, y: _this.height / 2, textAlign: "center" });
                    _this.stage.addChild(loadingText);
                    loadingText.text = "资源加载失败，请重新打开训练。";
                    _this.stage.update();
                });

                //加载资源路径
                var loadArr = [{ id: "mBG", src: "../../static/music/bg/s6.wav" }, { id: "mp1", src: "../../static/music/collision/pod.wav" }, { id: "mp2", src: "../../static/music/collision/nauty.wav" }, { id: "mp3", src: "../../static/music/effect/failure1.mp3" }, { id: "mp4", src: "../../static/music/effect/passSound.mp3" }];

                gameResource.loadManifest(loadArr);
            }
        }, {
            key: "onLoadingComplete",
            value: function onLoadingComplete() {
                var _this2 = this;

                this.stage.removeAllChildren();

                createjs.Sound.play("mBG", createjs.Sound.INTERRUPT_NONE, 0, 0, -1, 0.5, 0);
                //  this.levels = new babyEye.Level();//还有当前关数类，是babyEye.Level,用法完全一样，只是背景文字不同。
                this.index = new lib.index();
                this.world = null;
                this.message = new lib.message();
                this.stage.addChild(this.index);

                this.index.startBtn.addEventListener("click", function (ev) {
                    _this2.startGame();
                });
                this.message.win.nextBtn.addEventListener("click", function (ev) {
                    _this2.succeed();
                });
                this.message.fail.replayBtn.addEventListener("click", function (ev) {
                    _this2.fail();
                });
                this.replayButton = new babyEye.ReplayButton(function () {
                    _this2.replay();
                });
                this.helpButton = new babyEye.HelpButton(prepareConfig); //接受prepareConfig，返回类型bitmap
                this.score = new babyEye.Level();

                this.render();
            }
        }, {
            key: "startGame",
            value: function startGame() {
                this.stage.removeAllChildren();
                this.stage.cursor = "none";
                this.world = new World(this, this.logic());
                this.stage.addChild(this.world.view);
                this.stage.addChild(this.replayButton, this.helpButton, this.score.view);
                this.running = true;
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
                //  通关成功，进入下一关
                this.level++;
                this.score.changeValue(1);
                this.startGame();
            }
        }, {
            key: "fail",
            value: function fail() {
                // 通关失败，继续本关
                this.startGame();
            }
        }, {
            key: "logic",
            value: function logic() {
                var config = {
                    numWorm: 1,
                    numApple: 1,
                    deathT: 10000
                };

                var n1 = void 0,
                    n2 = void 0;

                if (this.shinning == "b") {
                    n2 = 1 + parseInt((this.level - 1) * Math.random());
                    var num = Math.sqrt(this.level);
                    n1 = parseInt(num);
                    n2 = 7;
                } else {
                    var _num = Math.sqrt(2 * this.level - 1);
                    n1 = parseInt(_num) + (_num % 1 > 0.5 && Math.random() > 0.5 ? 1 : 0);
                    n2 = parseInt(Math.random() * _num);
                    n2 = 0;
                }
                config.numApple = Math.min(n2, 7);
                config.numWorm = Math.min(n1, 10);
                return config;
            }
        }, {
            key: "showMessage",
            value: function showMessage(bool) {
                this.running = false;
                this.stage.cursor = "auto";
                if (bool) {
                    // pass the level
                    createjs.Sound.play("mp4");
                    this.message.win.visible = true;
                    this.message.fail.visible = false;
                    this.stage.addChild(this.message);
                } else {
                    // fail the level
                    createjs.Sound.play("mp3");
                    this.message.win.visible = false;
                    this.message.fail.visible = true;
                    this.stage.addChild(this.message);
                }
            }
        }, {
            key: "replay",
            value: function replay() {
                createjs.Sound.stop();
                this.pause();
                $(window).unbind(); //解绑事件
                this.stage.removeAllChildren();
                this.stage.removeAllEventListeners();
                this.stage.enableMouseOver(0);
                babyEye.prepareTrain(prepareConfig);
            }
        }, {
            key: "render",
            value: function render() {
                var _this3 = this;

                var timestamp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;


                if (this.pauseValue) return;
                if (this.failValue) return;

                var deltaTime = timestamp - this.time;
                if (deltaTime > 150 || deltaTime < 0) {
                    deltaTime = 0;
                }
                this.time = timestamp;
                if (this.running) this.world.update(deltaTime);
                this.stage.update();
                requestAnimationFrame(function (timestamp) {
                    _this3.render(timestamp);
                });
            }
        }]);

        return Game;
    }();

    var World = function () {
        function World(game, config) {
            _classCallCheck(this, World);

            this.game = game;
            this.runningTime = 0;
            this.worm = [];
            this.apple = [];
            this.target = null;
            this.buildView();
            this.buildBG();
            this.buildWorm(config.numWorm);
            this.buildApple(config.numApple);
            this.buildTool();
            this.events();
            this.shineT = 0;
            switch (game.shinning) {
                case "b":
                    this.shine = babyEye.selectFrom(this.apple, this.apple.length);
                    break;
                case "r":
                    this.shine = babyEye.selectFrom(this.worm, this.worm.length);
                    break;
            }
        }

        _createClass(World, [{
            key: "buildView",
            value: function buildView() {
                this.view = new createjs.Container();
                this.view.cursor = "none";
            }
        }, {
            key: "buildBG",
            value: function buildBG() {
                var bg = new lib.main();
                this.view.addChild(bg);
            }
        }, {
            key: "buildWorm",
            value: function buildWorm(num) {
                for (var i = 0; i < num; i++) {
                    var w = new Worm();
                    this.view.addChild(w);
                    this.worm.push(w);
                }
            }
        }, {
            key: "buildApple",
            value: function buildApple(num) {
                var _this4 = this;

                this.apple = [];
                babyEye.shuffle(APPLE);

                APPLE.forEach(function (p) {
                    var a = new lib.apple();
                    _this4.apple.push(a);
                    a.location = new babyEye.Vec2(p[0], p[1]);

                    if (num > 0) {
                        a.gotoAndStop(0);
                        num--;
                    } else {
                        a.gotoAndStop(1);
                    }
                    a.setTransform(a.location.x, a.location.y, 1, 1, babyEye.randomRange(-30, 30));

                    _this4.view.addChild(a);
                });
                this.worm.forEach(function (w) {
                    w.target = babyEye.selectFrom(_this4.apple, 1)[0];
                });
            }
        }, {
            key: "buildTool",
            value: function buildTool() {
                var _this5 = this;

                this.tool = new lib.tool();
                this.tool.gotoAndStop(0);
                this.tool.location = new babyEye.Vec2(this.game.stage.mouseX, this.game.stage.mouseY);
                this.tool.update = function () {
                    _this5.tool.setTransform(_this5.tool.location.x, _this5.tool.location.y);
                };
                this.tool.mouseEnable = false;
                this.view.addChild(this.tool);
            }
        }, {
            key: "events",
            value: function events() {
                var _this6 = this;

                if (babyEye.isMobile()) {
                    var mouseDownLocation = void 0,
                        dir = new babyEye.Vec2(),
                        netDownLocation = void 0;
                    this.view.addEventListener("mousedown", function (ev) {
                        if (!_this6.game.running) return;

                        mouseDownLocation = new babyEye.Vec2(ev.localX, ev.localY);
                        netDownLocation = _this6.tool.location.get();
                    });

                    this.game.stage.addEventListener("pressmove", function (ev) {
                        dir.set(ev.localX, ev.localY);
                        dir.sub(mouseDownLocation);
                        dir.add(netDownLocation);
                        dir.x = Math.max(10, dir.x);
                        dir.x = Math.min(dir.x, 1230);
                        dir.y = Math.max(30, dir.y);
                        dir.y = Math.min(dir.y, 710);
                        _this6.tool.location.set(dir.x, dir.y);
                    });

                    this.view.addEventListener("pressup", function (ev) {
                        if (!_this6.game.running) return;
                        if (_this6.target) {
                            createjs.Sound.play("mp2");
                            _this6.tool.gotoAndStop("s1");
                            if (babyEye.distance(_this6.tool.location.x, _this6.tool.location.y, 300, 415) < 80) {
                                _this6.game.stage.removeChild(_this6.target);
                                _this6.target.catched = true;
                                _this6.target.deathT = _this6.target.deathA = null;
                                _this6.target = null;
                                _this6.judge();
                            } else {
                                _this6.target.lock(false);
                            }
                            _this6.target = null;
                        } else {
                            createjs.Sound.play("mp1");

                            _this6.worm.forEach(function (fish) {
                                if (babyEye.Vec2.distance(fish.location, _this6.tool.location) < 30) {
                                    fish.lock();
                                    _this6.tool.gotoAndPlay("s3");
                                    _this6.target = fish;
                                    return;
                                }
                            });
                        }
                    });
                } else {
                    this.view.addEventListener("mousedown", function (ev) {
                        if (!_this6.game.running) return;
                        createjs.Sound.play("mp1");
                        _this6.tool.gotoAndStop("s2");
                        if (ev.target instanceof Worm) {
                            ev.target.lock();
                            _this6.tool.gotoAndPlay("s3");
                            _this6.target = ev.target;
                        }
                    });
                    this.game.stage.addEventListener("stagemousemove", function (ev) {
                        if (!_this6.game.running) return;
                        if (!ev.localX || !ev.localY) return;
                        _this6.tool.location.set(ev.localX, ev.localY);
                    });
                    this.game.stage.addEventListener("stagemouseup", function (ev) {
                        if (!_this6.game.running) return;

                        _this6.tool.gotoAndStop("s1");
                        if (_this6.target) {
                            createjs.Sound.play("mp2");
                            if (babyEye.distance(_this6.game.stage.mouseX, _this6.game.stage.mouseY, 300, 415) < 80) {
                                _this6.game.stage.removeChild(_this6.target);
                                _this6.target.catched = true;
                                _this6.target.deathT = _this6.target.deathA = null;
                                _this6.target = null;
                                _this6.judge();
                            } else {
                                _this6.target.lock(false);
                            }
                        }
                        _this6.target = null;
                    });
                }
            }
        }, {
            key: "judge",
            value: function judge() {
                for (var i = 0; i < this.worm.length; i++) {
                    if (!this.worm[i].catched) return;
                }
                this.game.showMessage(true);
            }
        }, {
            key: "update",
            value: function update(dt) {
                this.runningTime += dt;
                for (var i = 0; i < this.worm.length; i++) {
                    // this.worm[i].flee(this.tool.location,150);
                    var w = this.worm[i];
                    w.seek(w.target);
                    for (var j = 0; j < this.apple.length; j++) {
                        if (this.apple[j] == w.target) continue;
                        w.flee(this.apple[j].location, 50);
                    }

                    w.update(dt);
                    if (w.deathT) {
                        w.deathT -= dt;
                        if (w.deathT < 0) {
                            this.game.showMessage(false);
                            return;
                            // if(w.target.currentFrame == 0){
                            //     this.game.showMessage(false);
                            //     return;
                            // }else{
                            //     w.deathT = null;
                            //     w.target = babyEye.selectFrom(this.apple,1)[0];
                            // }
                        }
                    }
                }
                this.tool.update();
                this.shineT += dt;
                if (this.shineT > 500) {
                    this.shineT = 0;
                    this.shine.forEach(function (t) {
                        t.alpha = Math.abs(t.alpha - 1);
                    });
                }
            }
        }]);

        return World;
    }();

    var Worm = function (_lib$worm) {
        _inherits(Worm, _lib$worm);

        function Worm(x, y) {
            _classCallCheck(this, Worm);

            var _this7 = _possibleConstructorReturn(this, (Worm.__proto__ || Object.getPrototypeOf(Worm)).call(this));

            var hit = new createjs.Shape();
            hit.graphics.f("#ff0000").dr(-30, -2, 55, 23).ef();

            _this7.hitArea = hit;

            _this7.velocity = new babyEye.Vec2(Math.random(), Math.random());
            _this7.acceleration = new babyEye.Vec2(0, 0);
            _this7.maxSpeed = 0.02; //0.06;
            _this7.maxForce = 0.01; //0.05;
            _this7.r = 40;

            _this7.catched = false;
            _this7.target = null;
            _this7.buildSpace();
            // this.compositeOperation = "darken";
            _this7.location = new babyEye.Vec2(babyEye.randomRange(_this7.space.lowerX, _this7.space.higherX), babyEye.randomRange(_this7.space.lowerY, _this7.space.higherY));

            return _this7;
        }

        _createClass(Worm, [{
            key: "update",
            value: function update(dt) {
                if (this._lock) return;
                this.velocity.add(this.acceleration);
                // this.velocity.limit(this.maxSpeed);
                this.velocity.normalize();
                this.velocity.mult(this.maxSpeed);
                this.location.add(babyEye.Vec2.mult(this.velocity, dt));
                this.clearForce();
                this.bounds();
                var ro = this.velocity.heading();
                var scaleX = 1;
                if (ro > 90) {
                    scaleX = -1;
                    ro = ro - 180;
                } else if (ro < -90) {
                    scaleX = -1;
                    ro = 180 + ro;
                }
                this.setTransform(this.location.x, this.location.y, scaleX, 1, ro);
                // this.x += Math.random()*1;
                // this.y += Math.random()*1;
            }
        }, {
            key: "applyForce",
            value: function applyForce(f) {
                this.acceleration.add(f);
            }
        }, {
            key: "clearForce",
            value: function clearForce() {
                this.acceleration.x = 0;
                this.acceleration.y = 0;
            }
        }, {
            key: "bounds",
            value: function bounds() {
                if (this.location.x < this.space.lowerX) this.location.x = this.space.lowerX;
                if (this.location.y < this.space.lowerY) this.location.y = this.space.lowerY;
                if (this.location.x > this.space.higherX) this.location.x = this.space.higherX;
                if (this.location.y > this.space.higherY) this.location.y = this.space.higherY;
            }
        }, {
            key: "buildSpace",
            value: function buildSpace() {
                this.space = {
                    lowerX: 260 + this.r,
                    lowerY: this.r - 10,
                    higherX: 1044 - this.r,
                    higherY: 512 - this.r
                };
            }
        }, {
            key: "seek",
            value: function seek(target) {
                var dir = babyEye.Vec2.sub(target, this.location);
                if (dir.mag() < 30) {
                    if (this.deathT == undefined) {
                        this.deathT = 20000;
                    }
                    this.acceleration.mult(0);
                    this.velocity.limit(babyEye.map(dir.mag(), 0, 100, 0, this.maxSpeed));
                    return true;
                };
                dir.normalize();
                dir.mult(this.maxForce);
                this.applyForce(dir);
            }
        }, {
            key: "flee",
            value: function flee(target) {
                var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

                var dir = babyEye.Vec2.sub(this.location, target);
                var distance = dir.mag();
                if (distance > scope) {
                    return;
                };
                dir.normalize();
                dir.mult(this.maxForce);
                this.applyForce(dir);
            }
        }, {
            key: "lock",
            value: function lock() {
                var bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

                this.visible = !bool;
                //this.alpha = (bool?0:1);
                this._lock = bool;
            }
        }]);

        return Worm;
    }(lib.worm);
});