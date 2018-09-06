"use strict";

var _get = function get(_x5, _x6, _x7) { var _again = true; _function: while (_again) { var object = _x5, property = _x6, receiver = _x7; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x5 = parent; _x6 = property; _x7 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(window).ready(function () {
    var langleStyle = "cn";
    var prepareConfig = {
        instruction: "本训练是同时视训练。训练前请选择训练模式。每次训练请依次按照交替闪烁、差眼闪烁、同时闪烁的顺序进行训练，每个模式训练2分钟。当赛车完全进入加速带区域，点击键盘空格或训练界面触发赛车加速前进。为了加强训练效果，加速时赛车与加速带同步前进。",
        selectGlasses: true, //是否需要选择眼镜
        selectLazyEye: true, //是否需要选择差眼，如果该项为true，则必须让selectGlasses也为true，因为需要眼镜信息来计算目标的正确颜色。脱抑制用。
        selectDifficulty: false, //是否需要选择难度
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

    //开始训练函数
    function init(trainInfor) {
        window.game = new Game(trainInfor);
    }
    //声明训练资源
    var gameResource = null;

    var Game = (function () {
        function Game(trainInfor) {
            _classCallCheck(this, Game);

            this.trainInfor = trainInfor;
            this.stage = new createjs.Stage("game-canvas");
            this.stage.enableMouseOver();
            createjs.Touch.enable(this.stage);
            this.width = this.stage.canvas.width;
            this.height = this.stage.canvas.height;

            this.lastFrame = 0;
            this.worldTime = 0;
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

                var loadingText = new createjs.Text("0%", "24px Arial", "black");
                loadingText.set({ x: this.width / 2, y: this.height / 2, textAlign: "center" });
                this.stage.addChild(loadingText);

                gameResource.addEventListener("progress", function (ev) {
                    loadingText.text = (ev.progress * 100).toFixed() + "%";
                    _this.stage.update();
                });

                //加载资源路径
                var resources = [{ id: "selectBg", src: "../../../static/img/version5/background/selectMode.png" }, { id: "mBG", src: "../../../static/music/bg/s19.mp3" }, { id: "accelerate", src: "../src/sv-race/img/accelerate.png" }, { id: "accelerateB", src: "../src/sv-race/img/accelerateB.png" }, { id: "travel", src: "../src/sv-race/img/travel.png" }, { id: "time", src: "../src/sv-race/img/time.png" }, { id: "bg", src: "../src/sv-race/img/bg.png" }, { id: "end", src: "../src/sv-race/img/end.png" }, { id: "carR", src: "../src/sv-race/img/carR.png" }, { id: "carB", src: "../src/sv-race/img/carB.png" }, { id: "runSound", src: "../src/sv-race/sound/runSound.mp3" }];

                var loadArr = resources;

                var v5Path = "../../../static/img/version5/buttons/";
                var buttons = ["twinkle-altermate.png", "twinkle-lazy.png", "twinkle-same-time.png"].map(function (name) {
                    var id = name.slice(0, name.indexOf("."));
                    return { id: id, src: v5Path + name };
                });

                //加载
                gameResource.loadManifest(loadArr);
                gameResource.loadManifest(buttons);

                if (langleStyle === "cn") {
                    var cnImgArry = ["canFly-cn", "notFly-cn"];
                    var cnImgs = cnImgArry.map(function (cnImg) {
                        var id = cnImg.slice(0, cnImg.indexOf("-"));
                        return {
                            id: id,
                            src: "../src/sv-race/img/" + cnImg + ".png"
                        };
                    });
                    gameResource.loadManifest(cnImgs);

                    // let cnSoundArry = ["fail-cn","wonderful-cn"];
                    // let cnSounds = cnSoundArry.map((cnSound)=>{
                    //     let id = cnSound.slice(0,cnSound.indexOf("-"));

                    //     return {
                    //         id:id,
                    //         src:"src/music/" + cnSound + ".mp3"
                    //     }
                    // })
                    // gameResource.loadManifest(cnSounds);
                } else {
                        var enImgArry = ["canFly-en", "notFly-en"];
                        var enImgs = enImgArry.map(function (enImg) {

                            var id = enImg.slice(0, enImg.indexOf("-"));

                            return {
                                id: id,
                                src: "../src/sv-race/img/" + enImg + ".png"
                            };
                        });
                        gameResource.loadManifest(enImgs);

                        // let enSoundArry = ["fail-en","wonderful-en"];
                        // let enSounds = enSoundArry.map((enSound)=>{
                        //     let id = enSound.slice(0,enSound.indexOf("-"));

                        //     return {
                        //         id:id,
                        //         src:"src/music/" + enSound + ".mp3"
                        //     }
                        // })
                        // gameResource.loadManifest(enSounds);
                    }
            }
        }, {
            key: "onLoadingComplete",
            value: function onLoadingComplete() {
                this.stage.removeAllChildren();
                var sound = createjs.Sound.play("mBG", createjs.Sound.INTERRUPT_NONE, 0, 0, -1, 0.5, 0);
                this.buildWorld(); //产生训练场景
                this.buildButtons(); //产生训练按钮
                this.buildBorder(); //可选加
                this.render();
            }
        }, {
            key: "buildWorld",
            value: function buildWorld() {
                this.world = new World(this);
                this.stage.addChild(this.world.view);
            }
        }, {
            key: "buildButtons",
            value: function buildButtons() {
                var _this2 = this;

                this.replayButton = new babyEye.ReplayButton(function () {
                    _this2.replay();
                }); //参数为重新开始函数，返回类型bitmap
                this.helpButton = new babyEye.HelpButton(prepareConfig); //接受prepareConfig，返回类型bitmap

                this.stage.addChild(this.replayButton, this.helpButton);
            }
        }, {
            key: "buildBorder",
            value: function buildBorder() {
                var border = new createjs.Shape();
                border.graphics.ss(2).s("black").dr(0, 0, this.width, this.height);
                this.stage.addChild(border);
            }
        }, {
            key: "render",
            value: function render() {
                var _this3 = this;

                var timestamp = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

                if (this.pauseValue) return;
                if (this.failValue) return;

                var deltaTime = timestamp - this.lastFrame;
                if (deltaTime > 150 || deltaTime < 0) deltaTime = 0;
                this.lastFrame = timestamp;
                if (this.world.countDown) {
                    this.world.countDown.update(deltaTime); //更新倒计时
                }

                this.worldTime = deltaTime;
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

                this.stage.addChild(babyEye.successBitmap);
                setTimeout(function () {
                    _this4.stage.removeChild(babyEye.successBitmap);
                }, 1000);
            }
        }, {
            key: "fail",
            value: function fail() {
                this.failValue = true;
                this.stage.addChild(babyEye.failBitmap);
            }
        }, {
            key: "replay",
            value: function replay() {
                createjs.Sound.stop();
                $(window).unbind(); //解绑事件
                this.stage.removeAllChildren();
                this.stage.removeAllEventListeners();
                this.pause();
                babyEye.prepareTrain(prepareConfig);
            }
        }]);

        return Game;
    })();

    var World = (function () {
        function World(game) {
            _classCallCheck(this, World);

            this.game = game;
            this.view = new createjs.Container();
            this.loadData = new LoadData();
            this.centerX = this.game.width * 0.5;
            this.centerY = this.game.height * 0.5;
            this.startSpeed = 4;
            this.speed = this.startSpeed;
            this.accSpeed = this.speed;

            this.acceRote = 0;
            this.startLoop = 200;
            this.isClick = true;
            this.runLoop = this.startLoop;
            this.startTime = 0;
            this.clockTime = 0;

            this.chickNum = 0;
            this.endNum = 20;

            this.canFly = true;
            this.startFly = 0;
            this.flyNum = 500;
            this.buildCarBG();
        }

        _createClass(World, [{
            key: "buildCountDown",
            value: function buildCountDown() {
                var _this5 = this;

                if (this.countDown) this.view.removeChild(this.countDown.view);
                var config = {
                    duration: 120 * 1000, //倒计时时间
                    callback: function callback() {
                        //倒计时为0时候的回调函数
                        _this5.game.replay();
                    }
                };

                this.countDown = new babyEye.CountDown(config);
                this.view.addChild(this.countDown.view);
            }
        }, {
            key: "buildCarBG",
            value: function buildCarBG() {
                var _this6 = this;

                var selectBgImg = gameResource.getResult("selectBg");
                var selectBgMap = new createjs.Bitmap(selectBgImg);
                this.view.addChild(selectBgMap);

                var imgArray = ["twinkle-altermate", "twinkle-lazy", "twinkle-same-time"];

                var _loop = function (i) {
                    var carImage = gameResource.getResult(imgArray[i]);

                    var carBitMap = new createjs.Bitmap(carImage);
                    var x = _this6.centerX;
                    var y = 240 + 120 * i;
                    carBitMap.set({ x: x, y: y, regX: carImage.width * 0.5, regY: carImage.height * 0.5, scaleX: 1, scaleY: 1 });
                    carBitMap.addEventListener("mousedown", function () {
                        _this6.chioce = i;
                        _this6.view.removeAllChildren();
                        _this6.view.removeAllEventListeners();
                        _this6.buildBg();
                        _this6.buildCar();
                        _this6.buildCountDown();
                        _this6.builLevel();
                        _this6.events();
                    });
                    _this6.view.addChild(carBitMap);
                };

                for (var i = 0; i < imgArray.length; i++) {
                    _loop(i);
                }
            }
        }, {
            key: "buildBg",
            value: function buildBg() {
                this.road = new Road(this);
                this.travelImg = gameResource.getResult("travel");
                this.travel = new createjs.Bitmap(this.travelImg);
                this.travel.set({ x: 750, y: 15 });
                this.result = new c.Text(Math.floor(this.road.distance * 0.1), "25px Arial", "white");
                this.result.textAlign = "center";
                this.result.set({ x: 870, y: 33 });
                this.view.addChild(this.road, this.travel, this.result);

                this.canFlyImg = gameResource.getResult("canFly");
                this.notFlyImg = gameResource.getResult("notFly");

                this.flyMap = new createjs.Bitmap(this.canFlyImg);
                this.flyMap.set({ x: 80, y: 650, regX: this.canFlyImg.width * 0.5, regY: this.canFlyImg.height * 0.5, rotation: 30 });
                this.view.addChild(this.flyMap);
                console.log(this.flyMap);

                // this.timeImg =  gameResource.getResult("time");
                // this.timeMap = new createjs.Bitmap(this.timeImg);
                // this.timeMap.set({x:1000,y:15});

                // this.timeText = new c.Text( " "  , "25px Arial", "white");
                // this.timeText.textAlign = "center";
                // this.timeText.set({x:1150,y:33})
                // this.view.addChild(this.road,this.travel,this.result,this.timeMap,this.timeText);

                // let closeShape = new createjs.Shape();
            }
        }, {
            key: "buildCar",
            value: function buildCar() {
                this.roadCon = new createjs.Container();
                this.view.addChild(this.roadCon);
                this.accelerateB = gameResource.getResult("accelerateB");
                this.accelerateR = gameResource.getResult("accelerate");
                this.accelerateBitMap = new createjs.Bitmap(this.accelerateB);
                this.accelerateBitMap.set({ x: this.game.width, y: this.centerY, regX: this.accelerateR.width * 0.5, regY: this.accelerateR.height * 0.5, scaleX: 0.7, scaleY: 0.7 });

                this.carRImg = gameResource.getResult("carR");
                this.carBImg = gameResource.getResult("carB");

                this.carBitMap = new createjs.Bitmap(this.carRImg);
                this.carBitMap.set({ x: 200, y: this.centerY, regX: this.carRImg.width * 0.5, regY: this.carRImg.height * 0.5, scaleX: 0.8, scaleY: 0.8 });
                this.roadCon.addChild(this.carBitMap, this.accelerateBitMap);
                this.roadCon.compositeOperation = "darken"; //source-over
            }
        }, {
            key: "runCar",
            value: function runCar() {
                // this.clockTime+=this.game.worldTime;
                // if(this.timeText.text === 0){               
                //         this.showEnd();
                // }else{
                this.road.update();

                if (this.speed === this.startSpeed * 4) {
                    this.runLoop--;
                    this.carBitMap.x += this.speed * 0.25;
                    this.accelerateBitMap.x += this.speed * 0.25;
                    this.acceRote += 8;
                    this.accelerateBitMap.rotation = this.acceRote;
                } else {
                    this.accelerateBitMap.x -= this.speed;
                }
                if (!this.runLoop) {
                    if (this.isClick) {}
                    this.deceleCar();
                }
                if (this.accelerateBitMap.x <= 20) {
                    this.accelerateBitMap.x = this.game.width * 1.2;
                }

                if (this.startFly === this.flyNum) {
                    this.startFly = 0;
                    this.canFly = true;
                    this.flyMap.image = this.canFlyImg;
                } else {
                    this.startFly++;
                }
                this.result.text = Math.floor(this.road.distance * 0.01);
                // this.timeText.text = 300 - Math.floor(this.clockTime * 0.001);
                // }
            }
        }, {
            key: "deceleCar",
            value: function deceleCar() {
                if (this.speed !== this.startSpeed && this.speed > this.startSpeed) {
                    this.speed -= 0.05;
                    this.carBitMap.x -= 3.3;
                    this.accelerateBitMap.x = this.carBitMap.x + 10;
                    this.acceRote++;
                    this.accelerateBitMap.rotation = this.acceRote;
                } else {
                    this.accelerateBitMap.x = this.game.width * 1.2;

                    if (this.carBitMap.x !== 200) {
                        this.carBitMap.x = 200;
                    }
                    this.speed = this.startSpeed;
                    this.runLoop = this.startLoop;
                    this.isClick = true;
                    // this.flyMap.image = this.canFlyImg;
                }
            }
        }, {
            key: "showEnd",
            value: function showEnd() {
                var _this7 = this;

                var endImg = gameResource.getResult("end");
                var endMap = new createjs.Bitmap(endImg);
                endMap.set({ x: this.centerX, y: this.centerY, regX: endImg.width * 0.5, regY: endImg.height * 0.5 });
                this.view.addChild(endMap);

                var endText = new createjs.Text(this.result.text, "50px Arial", "white");
                endText.set({ x: this.centerX, y: 440 });
                endText.textAlign = "center";
                this.view.addChild(endText);

                endMap.addEventListener("mousedown", function (ev) {
                    if (ev.rawX > 823 && ev.rawX < 912 && ev.rawY > 190 && ev.rawY < 290) {
                        _this7.game.replay();
                    }
                });
            }
        }, {
            key: "builLevel",
            value: function builLevel() {
                switch (this.chioce) {
                    case 0:
                        this.accelerateBitMap.image = this.accelerateR;
                        this.carBitMap.image = this.carBImg;
                        this.alternate();
                        break;
                    case 1:
                        this.bad = this.game.trainInfor.targetInfor.color;
                        this.choiceBadEye();
                        this.badEye();
                        break;
                    case 2:
                        this.accelerateBitMap.image = this.accelerateR;
                        this.carBitMap.image = this.carRImg;
                        this.allEye();
                    default:
                        break;
                }
            }
        }, {
            key: "alternate",
            value: function alternate() {
                var _this8 = this;

                if (this.chickNum === this.endNum) {
                    this.carBitMap.image === this.carRImg ? this.carBitMap.image = this.carBImg : this.carBitMap.image = this.carRImg;
                    this.accelerateBitMap.image === this.accelerateB ? this.accelerateBitMap.image = this.accelerateR : this.accelerateBitMap.image = this.accelerateB;
                    this.chickNum = 0;
                } else {
                    this.chickNum++;
                }
                this.runCar();
                window.requestAnimationFrame(function () {
                    var time = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

                    _this8.alternate();
                });
            }
        }, {
            key: "choiceBadEye",
            value: function choiceBadEye() {
                if (this.bad === "red") {
                    this.accelerateBitMap.image = this.accelerateB;
                    // this.accelerateBitMap.image === this.accelerateB ? this.accelerateBitMap.image = this.accelerateB :this.accelerateBitMap.image = this.accelerateB;

                    this.carBitMap.image = this.carRImg;
                } else {
                    this.accelerateBitMap.image = this.accelerateR;
                    this.carBitMap.image = this.carBImg;
                }
            }
        }, {
            key: "badEye",
            value: function badEye() {
                var _this9 = this;

                if (this.chickNum === this.endNum) {
                    this.carBitMap.alpha === 1 ? this.carBitMap.alpha = 0 : this.carBitMap.alpha = 1;
                    this.chickNum = 0;
                    // this.accelerateBitMap.image = this.accelerateB;
                } else {
                        this.chickNum++;
                    }
                this.runCar();
                window.requestAnimationFrame(function () {
                    var time = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

                    _this9.badEye();
                });
            }
        }, {
            key: "allEye",
            value: function allEye() {
                var _this10 = this;

                if (this.chickNum === this.endNum) {
                    this.carBitMap.image === this.carBImg ? this.carBitMap.image = this.carRImg : this.carBitMap.image = this.carBImg;
                    this.accelerateBitMap.image === this.accelerateB ? this.accelerateBitMap.image = this.accelerateR : this.accelerateBitMap.image = this.accelerateB;

                    this.chickNum = 0;
                } else {
                    this.chickNum++;
                }

                this.runCar();

                window.requestAnimationFrame(function () {
                    var time = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

                    _this10.allEye();
                });
            }
        }, {
            key: "events",
            value: function events() {
                var _this11 = this;

                this.game.stage.addEventListener("stagemousedown", function () {
                    if (_this11.canFly) {
                        _this11.flyMap.image = _this11.notFlyImg;
                        _this11.canFly = false;
                        _this11.startFly = 0;
                        if (_this11.runLoop === _this11.startLoop && _this11.accelerateBitMap.x <= 260 && _this11.accelerateBitMap.x >= 145) {
                            if (_this11.isClick) {
                                var a = createjs.Sound.play("runSound", createjs.Sound.INTERRUPT_NONE, 0, 0, 0, 0.5, 0);
                                _this11.speed = _this11.speed * 4;
                                _this11.isClick = false;
                                //
                            }
                        }
                    }
                });
                this.keyMap = {};
                $(window).unbind("keydown");
                $(window).bind("keydown", function (ev) {
                    if (ev.keyCode === 32 && _this11.canFly) {
                        _this11.flyMap.image = _this11.notFlyImg;
                        _this11.canFly = false;
                        _this11.startFly = 0;
                        if (_this11.runLoop === _this11.startLoop && _this11.accelerateBitMap.x <= 260 && _this11.accelerateBitMap.x >= 145) {
                            _this11.keyMap[ev.keyCode] = true;
                            if (_this11.isClick) {
                                var a = createjs.Sound.play("runSound", createjs.Sound.INTERRUPT_NONE, 0, 0, 0, 0.5, 0);
                                _this11.speed = _this11.speed * 4;
                                _this11.isClick = false;
                                //                       
                            }
                        }
                    }
                });
            }
        }]);

        return World;
    })();

    var Road = (function (_createjs$Container) {
        _inherits(Road, _createjs$Container);

        function Road(world) {
            _classCallCheck(this, Road);

            _get(Object.getPrototypeOf(Road.prototype), "constructor", this).call(this);
            this.world = world;
            this.game = world.game;
            this.distance = 0;

            var roadUp = new createjs.Bitmap(gameResource.getResult("bg"));
            roadUp.set({
                scaleX: this.game.width / roadUp.image.width,
                scaleY: this.game.height / roadUp.image.height
            });

            var roadDown = roadUp.clone();
            roadDown.x = this.game.width;
            this.addChild(roadUp, roadDown);
            this.x = 0;

            this.roadMap = [[340, 575], [575, 835], [835, 1095], [1094, 1340]];
        }

        _createClass(Road, [{
            key: "update",
            value: function update() {
                var sp = this.world.speed;
                if (this.x - sp < -this.game.width) {
                    this.x = 0;
                }
                this.x -= sp;
                this.distance += sp;
            }
        }]);

        return Road;
    })(createjs.Container);

    var LoadData = (function () {
        function LoadData() {
            _classCallCheck(this, LoadData);
        }

        _createClass(LoadData, [{
            key: "getResultsOfQueue",
            value: function getResultsOfQueue(resultArr) {
                var resultArray = [];
                var length = resultArr.length;
                for (var i = 0; i < length; i++) {
                    var type = resultArr[i];
                    var objResult = window.queue.getResult(type);
                    resultArray.push(objResult);
                }
                return resultArray;
            }
        }, {
            key: "getResultById",
            value: function getResultById(idNum) {
                var objResult = window.queue.getResult(idNum);
                return objResult;
            }
        }]);

        return LoadData;
    })();
});