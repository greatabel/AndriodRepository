"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(window).ready(function () {
    var prepareConfig = {
        instruction: "本训练为立体视训练。首先选择所佩戴的眼镜类型，并每日交替使用红蓝、蓝红眼镜。训练开始后请注意画面中的小海豚与游泳圈跟您的距离，当海豚比圈更靠近您时，按空格键或者鼠标点击画面。答对之后会出现回答正确的提示音。每答对5次，可进入下一关。",
        selectGlasses: true, //是否需要选择眼镜
        selectLazyEye: false, //是否需要选择差眼，如果该项为true，则必须让selectGlasses也为true，因为需要眼镜信息来计算目标的正确颜色。脱抑制用。
        selectDifficulty: false, //是否需要选择难度
        staticPath: "../../static/", //该训练的html相对于static文件夹的路径
        callback: function callback(trainInfor) {
            // 完成选择后的回调函数，将开始训练放在其中，trainInfor是患者选择的结果
            //trainInfor.glasses为"rb"或"br"
            //trainInfor.difficulty为难度easy hard medium
            //targetInfor里面有color和filter，是脱抑制的目标颜色信息。打印看看
            // console.log(trainInfor);
            init(trainInfor); //选择完成后，开始训练函数
        }
    };

    babyEye.prepareTrain(prepareConfig); //选择训练参数和说明展示

    // //begin for develop--------------------------------
    // let prepareConfig = {
    //     staticPath: "../../../static/",//该训练的html相对于static文件夹的路径
    //     callback: ()=>{
    //         let trainInfor = {
    //             glasses:"rb",
    //             difficulty: "easy",
    //             targetInfor:{color: "red", filter: new createjs.ColorFilter(1,0,0,1,255,0,0,0)}
    //         }
    //         console.log(trainInfor)
    //         init(trainInfor);//选择完成后，开始训练函数
    //     }
    // }

    // babyEye.prepareTrain(prepareConfig);
    // //end for develop------------------------------------

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
            this.glass = trainInfor.glasses;
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
                var loadArr = [{ id: "mBG", src: "../../static/music/bg/ex7.mp3" }, { id: "wonderful", src: "../../static/music/wonderful.mp3" }];

                // let v5NumPath = "../../static/img/numbers/";
                // let nums = ["score0.png","score1.png", "score2.png","score3.png","score4.png","score5.png","score6.png","score7.png","score8.png","score9.png"]
                // .map(name =>{      
                //     let id = name.slice(0,name.indexOf("."));
                //     return {id: id , src: v5NumPath + name}
                // });

                var resPath = "../src/ste-fishDancer/img/";

                var res = ["bg.png", "circeB.png", "circeR.png", "leftB.png", "leftR.png", "rightB.png", "rightR.png"].map(function (name) {
                    var id = name.slice(0, name.indexOf("."));
                    return { id: id, src: resPath + name };
                });
                //加载
                gameResource.loadManifest(loadArr);
                gameResource.loadManifest(res);
                // gameResource.loadManifest(nums);  
            }
        }, {
            key: "onLoadingComplete",
            value: function onLoadingComplete() {
                this.stage.removeAllChildren();
                createjs.Sound.play("mBG", createjs.Sound.INTERRUPT_NONE, 0, 0, -1, 0.5, 0);
                this.levels = new babyEye.Level(); //还有当前关数类，是babyEye.Level,用法完全一样，只是背景文字不同。

                this.buildWorld(); //产生训练场景
                this.buildButtons(); //产生训练按钮
                this.buildCountDown(); //倒计时 可选加
                this.buildBorder(); //边界 可选加
                this.buildLevel();
                this.render();
            }
        }, {
            key: "buildWorld",
            value: function buildWorld() {
                this.world = new World(this);
                this.stage.addChild(this.world.view);
            }
        }, {
            key: "buildLevel",
            value: function buildLevel() {
                this.levels.view.x -= 210; //因为倒计时已经占据了右上角位置，所以要调整分数的默认位置
                this.stage.addChild(this.levels.view);

                //用法
                this.levels.setValue(1); //设置当前的数值
                // this.score.changeValue(-3)//将当前数值减三
                // this.score.value //获取当前数值值
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
            key: "buildBorder",
            value: function buildBorder() {
                var border = new createjs.Shape();
                border.graphics.ss(2).s("black").dr(0, 0, this.width, this.height);
                this.stage.addChild(border);
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
                        _this3.fail();
                    }
                };

                this.countDown = new babyEye.CountDown(config);
                this.stage.addChild(this.countDown.view);
            }
        }, {
            key: "render",
            value: function render() {
                var _this4 = this;

                var timestamp = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

                if (this.pauseValue) return;
                if (this.failValue) return;

                var dt = timestamp - this.lastFrame;
                if (dt > 150 || dt < 0) dt = 0;
                this.lastFrame = timestamp;

                this.countDown.update(dt); //更新倒计时
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
            }
        }, {
            key: "fail",
            value: function fail() {
                this.failValue = true;

                // this.stage.addChild(babyEye.failBitmap);
                this.endPopUp = new babyEye.PopUp({
                    text: "训练结束\n"
                });

                this.endPopUp.text.textAlign = "center";
                this.endPopUp.text.font = "50px fantasy";
                this.endPopUp.text.y += 70;
                this.endPopUp.text.x += 150;
                this.stage.addChild(this.endPopUp.view);
            }
        }, {
            key: "replay",
            value: function replay() {
                $(window).unbind(); //解绑事件
                createjs.Sound.stop();
                this.stage.removeAllChildren();
                this.stage.removeAllEventListeners();
                this.pause();
                babyEye.prepareTrain(prepareConfig);
            }
        }]);

        return Game;
    })();

    var Num = (function () {
        function Num(config) {
            _classCallCheck(this, Num);

            this.nums = config.nums;
            this.x = config.x;
            this.y = config.y;
            this.numX = config.x;
            this.numY = config.y;
            this.width = config.width;
            this.height = config.height;
            this.view = new createjs.Container();
            this.numToArr();
        }

        _createClass(Num, [{
            key: "numToArr",
            value: function numToArr() {
                this.numImgArr = [];
                for (var i = 0; i < 10; i++) {
                    var numId = "score" + i;
                    var numImg = gameResource.getResult(numId);
                    this.numImgArr.push(numImg);
                }
                var str = this.nums.toString();
                var splitString = str.split("");
                for (var i = 0; i < splitString.length; i++) {
                    var numImg = this.numImgArr[Number(splitString[i])];
                    var imgBitMap = new createjs.Bitmap(numImg);
                    var x = this.numX;
                    var hs = this.height / numImg.height;

                    imgBitMap.set({ x: x, y: this.y, scaleX: 1, scaleY: 1 });
                    this.numX += numImg.width;
                    this.view.addChild(imgBitMap);
                }
            }
        }]);

        return Num;
    })();

    var World = (function () {
        function World(game) {
            _classCallCheck(this, World);

            this.game = game;
            this.targetInfor = this.game.trainInfor.targetInfor;
            this.glass = game.glass;

            this.width = this.game.width;
            this.height = this.game.height;
            this.center = {
                x: this.width * 0.5,
                y: this.height * 0.5
            };

            this.level = 0;
            this.score = 0;
            this.levelNum = 1;
            this.dolphinSpeed = 0.2;
            this.dolphinRange = 25;
            this.circleRange = 120;
            this.runstartNum = 0;
            this.runEndNum = this.dolphinRange / this.dolphinSpeed;

            this.clickNum = 0;
            this.clickEndNum = this.runEndNum * 2;
            this.isClick = true;

            this.isRun = true;

            this.tailIndex = 0;
            this.tailNum = 50;

            this.view = new createjs.Container();
            this.buildChioceWorld();
        }

        _createClass(World, [{
            key: "buildChioceWorld",
            value: function buildChioceWorld() {
                this.view.removeAllChildren();
                this.circeB = gameResource.getResult("circeB");
                this.circeR = gameResource.getResult("circeR");
                this.dolphinLeftB = gameResource.getResult("leftB");
                this.dolphinLeftR = gameResource.getResult("leftR");
                this.dolphinRightR = gameResource.getResult("rightR");
                this.dolphinRightB = gameResource.getResult("rightB");

                if (this.glass === "br") {
                    this.leftCircle = this.circeB;
                    this.rightCircle = this.circeR;
                } else {
                    this.leftCircle = this.circeR;
                    this.rightCircle = this.circeB;
                }

                var imgArry = [this.dolphinLeftR, this.dolphinLeftB];
                var index = babyEye.randomRange(0, 1000) % 2;
                this.leftDolphin = imgArry[index];
                this.leftDolphin === this.dolphinLeftR ? this.rightDolphin = this.dolphinLeftB : this.rightDolphin = this.dolphinLeftR;
                this.buildChioce();
            }
        }, {
            key: "buildChioce",
            value: function buildChioce() {
                this.buildBg();
                this.events();
                this.buildLevelStart();
                this.update();
            }
        }, {
            key: "buildBg",
            value: function buildBg() {

                var bgImg = gameResource.getResult("bg");
                this.bgMap = new createjs.Bitmap(bgImg);
                this.view.addChild(this.bgMap);

                this.imgContain = new createjs.Container();
                this.view.addChild(this.imgContain);
                this.imgContain.compositeOperation = "darken"; //source-over

                this.leftCircleMap = this.buildCenterBitMap(this.leftCircle);
                this.rightCircleMap = this.buildCenterBitMap(this.rightCircle);
                this.leftCircleMap.set({ scaleX: 0.76, scaleY: 0.76 });
                this.rightCircleMap.set({ scaleX: 0.76, scaleY: 0.76 });

                this.leftDolphinMap = this.buildCenterBitMap(this.leftDolphin);
                this.rightDolphinMap = this.buildCenterBitMap(this.rightDolphin);

                this.imgContain.addChild(this.leftCircleMap, this.rightCircleMap, this.leftDolphinMap, this.rightDolphinMap);

                // this.buildCountDown();
            }
        }, {
            key: "buildCenterBitMap",
            value: function buildCenterBitMap(img) {
                var bitMap = new createjs.Bitmap(img);
                bitMap.set({ x: this.center.x, y: this.center.y, regX: img.width * 0.5, regY: img.height * 0.5 });
                return bitMap;
            }
        }, {
            key: "buildLevelStart",
            value: function buildLevelStart() {

                this.isRun = false;
                this.level++;
                this.game.levels.changeValue(+1);
                this.isClick = true;
                this.isRun = true;
                if (this.level > 5) {
                    this.dolphinRange = 50;
                }
                if (this.level < 10) {
                    this.leftCircleMap.x -= this.levelNum;
                    this.rightCircleMap.x += this.levelNum;
                }
                var imgArry = [this.dolphinLeftR, this.dolphinLeftB];
                var index = babyEye.randomRange(0, 1000) % 2;
                this.leftDolphin = imgArry[index];
                this.leftDolphin === this.dolphinLeftR ? this.rightDolphin = this.dolphinLeftB : this.rightDolphin = this.dolphinLeftR;
                this.leftDolphinMap.image = this.leftDolphin;
                this.rightDolphinMap.image = this.rightDolphin;

                this.leftDolphinMap.x = this.center.x;
                this.rightDolphinMap.x = this.center.x;
                this.tailIndex = 0;
                this.runstartNum = 0;
                this.runEndNum = this.dolphinRange / this.dolphinSpeed;
                this.tailIndex = 0;
                // this.tailNum = 50;
                this.isRun = true;
            }
        }, {
            key: "builTail",
            value: function builTail() {

                if (this.tailIndex === this.tailNum) {
                    this.tailIndex = 0;

                    switch (this.leftDolphin) {
                        case this.dolphinLeftR:
                            this.leftDolphin = this.dolphinRightR;this.rightDolphin = this.dolphinRightB;

                            break;
                        case this.dolphinLeftB:
                            this.leftDolphin = this.dolphinRightB;this.rightDolphin = this.dolphinRightR;

                            break;
                        case this.dolphinRightR:
                            this.leftDolphin = this.dolphinLeftR;this.rightDolphin = this.dolphinLeftB;

                            break;
                        case this.dolphinRightB:
                            this.leftDolphin = this.dolphinLeftB;this.rightDolphin = this.dolphinLeftR;

                            break;

                        default:
                            break;
                    }

                    this.leftDolphinMap.image = this.leftDolphin;
                    this.rightDolphinMap.image = this.rightDolphin;
                } else {
                    this.tailIndex++;
                }
            }
        }, {
            key: "buildRunDolphin",
            value: function buildRunDolphin() {
                this.runstartNum++;
                if (this.runstartNum < this.runEndNum) {
                    this.leftDolphinMap.x += this.dolphinSpeed;
                    this.rightDolphinMap.x -= this.dolphinSpeed;
                } else if (this.runstartNum >= this.runEndNum && this.runstartNum < this.runEndNum * 3 - 1) {
                    this.leftDolphinMap.x -= this.dolphinSpeed;
                    this.rightDolphinMap.x += this.dolphinSpeed;
                } else if (this.runstartNum >= this.runEndNum * 3 - 1 && this.runstartNum < this.runEndNum * 4 - 1) {
                    this.leftDolphinMap.x += this.dolphinSpeed;
                    this.rightDolphinMap.x -= this.dolphinSpeed;
                } else {
                    this.runstartNum = 0;
                }
            }
        }, {
            key: "update",
            value: function update() {
                var _this6 = this;

                var timestamp = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

                if (this.isRun) {
                    this.buildRunDolphin();
                    this.builTail();
                }
                this.canClick();
                requestAnimationFrame(function (timestamp) {
                    _this6.update(timestamp);
                });
            }
        }, {
            key: "canClick",
            value: function canClick() {
                var mid = this.rightDolphinMap.x - this.center.x;
                if (mid === 0) {
                    this.isClick = true;
                }
            }
        }, {
            key: "events",
            value: function events() {
                var _this7 = this;

                this.game.stage.addEventListener("stagemouseup", function () {
                    // this.dis = this.rightDolphinMap.x - this.rightCircleMap.x ;
                    if (_this7.isClick) {
                        _this7.isClick = false;
                        _this7.judeResult();
                    }
                });
                this.keyMap = {};
                $(window).unbind("keydown");
                $(window).bind("keydown", function (ev) {
                    if (ev.keyCode === 32) {
                        _this7.keyMap[ev.keyCode] = true;
                        // this.dis = this.rightDolphinMap.x - this.rightCircleMap.x ;
                        if (_this7.isClick) {
                            _this7.isClick = false;
                            _this7.judeResult();
                        }
                    }
                });
            }
        }, {
            key: "judeResult",
            value: function judeResult() {

                if (this.glass === "br") {
                    if (this.rightDolphinMap.image === this.dolphinLeftR || this.rightDolphinMap.image === this.dolphinRightR) {
                        this.dis = this.rightDolphinMap.x - this.rightCircleMap.x;
                    } else {
                        this.dis = this.leftDolphinMap.x - this.rightCircleMap.x;
                    }
                } else {
                    if (this.rightDolphinMap.image === this.dolphinLeftB || this.rightDolphinMap.image === this.dolphinRightB) {
                        this.dis = this.rightDolphinMap.x - this.rightCircleMap.x;
                    } else {
                        this.dis = this.leftDolphinMap.x - this.rightCircleMap.x;
                    }
                }

                this.isRun = false;
                if (this.dis >= 0) {
                    this.judeSucceed();
                } else {
                    this.judecFalse();
                }
                var imgArry = [this.dolphinLeftR, this.dolphinLeftB];
                var index = babyEye.randomRange(0, 1000) % 2;
                this.leftDolphin = imgArry[index];
                this.leftDolphin === this.dolphinLeftR ? this.rightDolphin = this.dolphinLeftB : this.rightDolphin = this.dolphinLeftR;

                this.leftDolphinMap.image = this.leftDolphin;
                this.rightDolphinMap.image = this.rightDolphin;

                this.leftDolphinMap.x = this.center.x;
                this.rightDolphinMap.x = this.center.x;
                this.isClick = true;
                this.runstartNum = 0;
                this.tailIndex = 0;
            }
        }, {
            key: "judeSucceed",
            value: function judeSucceed() {
                createjs.Sound.play("wonderful", createjs.Sound.INTERRUPT_NONE, 0, 0, 0, 0.5, 0);
                if (this.score === 4) {
                    this.buildLevelStart();
                    this.score = 0;
                } else {
                    this.score++;
                }
                this.isRun = true;
            }
        }, {
            key: "judecFalse",
            value: function judecFalse() {
                this.score = 0;
                this.isRun = true;
            }
        }, {
            key: "show",
            value: function show() {
                if (this.endPopUp) {
                    this.view.removeChild(this.endPopUp.view);
                }

                var textNum = (this.dis / 20).toFixed(2);
                this.endPopUp = new babyEye.PopUp({
                    text: "融合范围：" + textNum + "\n"
                });

                this.endPopUp.text.textAlign = "center";
                this.endPopUp.text.y += 70;
                this.endPopUp.text.x += 150;
                this.view.addChild(this.endPopUp.view);
            }
        }]);

        return World;
    })();
});