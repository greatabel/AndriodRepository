var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.init = function () {
    var loadingValue = $("#loading span");
    window.queue = new c.LoadQueue();
    window.queue.installPlugin(createjs.Sound);
    window.queue.addEventListener("complete", function (ev) {
        window.game = new Game();
        $("#loading").hide();
    });
    window.queue.addEventListener("progress", function (ev) {
        // loadingValue.text((ev.progress * 100).toFixed() + "%");
    });
    window.queue.loadManifest([{ id: "pointsound", src: "music/pointsound.mp3" }, { id: "noMuc", src: "music/noMuc.mp3" }, { id: "s2", src: "music/s2.mp3" }, { id: "nzb", src: "music/nzb.mp3" }]);
    window.queue.loadManifest([{ id: "1", src: "image/assest/1.png" }, { id: "2", src: "image/assest/2.png" }, { id: "3", src: "image/assest/3.png" }, { id: "4", src: "image/assest/4.png" }, { id: "5", src: "image/assest/5.png" }, { id: "6", src: "image/assest/6.png" }, { id: "restart", src: "image/assest/restart.png" }, { id: "scBtn", src: "image/direPic/scBtn.png" }, { id: "sgBtn", src: "image/direPic/sgBtn.png" }, { id: "pjBtn", src: "image/direPic/middle.png" }, { id: "getScore", src: "image/assest/getScore.png" }, { id: "gamebg", src: "image/assest/gamebg.png" }, { id: "timer", src: "image/assest/timer.png" }]);
};

var Game = (function () {
    function Game() {
        _classCallCheck(this, Game);

        this.stage = new c.Stage("game-canvas");
        c.Touch.enable(this.stage);
        this.stage.enableMouseOver();
        this.width = this.stage.canvas.width;
        this.height = this.stage.canvas.height;
        this.nTimeCount = 300;
        this.gameDataSheet();
        this.render();
        createjs.Sound.play("s2", createjs.Sound.INTERRUPT_NONE, 0, 0, -1, 1, 0);
    }

    _createClass(Game, [{
        key: "render",
        value: function render() {
            var _this = this;

            this.stage.update();
            window.requestAnimationFrame(function () {
                _this.render();
            });
        }
    }, {
        key: "gameDataSheet",
        value: function gameDataSheet() {
            window.ceil = window.localStorage.vision;
            window.score = 0;
            this.firstScreen();
        }
    }, {
        key: "firstScreen",
        value: function firstScreen() {
            var gameView;
            this.gameView = new createjs.Container();
            this.stage.addChild(this.gameView);
            this.gamebg();
            this.bgMain(); //游戏背景
            this.Layout(); //游戏布局按钮，游戏逻辑
            this.fCountTime(); //倒计时模块
        }
    }, {
        key: "killScore",
        value: function killScore() {
            var gameView = undefined;
            this.gameView = new createjs.Container();
            this.stage.addChild(this.gameView);
            this.bgMain(); //游戏背景

            //得分面板
            var scorePanel = new createjs.Bitmap(window.queue.getResult("getScore"));
            scorePanel.x = 390;
            scorePanel.y = 50;
            this.gameView.addChild(scorePanel);
            // 得分　
            var text_score = new createjs.Text(window.score, "38px Arial", "#ffffff");
            text_score.x = 710;
            text_score.y = 190;
            text_score.textAlign = "center";
            this.gameView.addChild(text_score);
            //   重新开始
            var restart = new createjs.Bitmap(window.queue.getResult("restart"));
            restart.x = 560;
            restart.y = 0;
            createjs.Tween.get(restart).to({ x: restart.x, y: restart.y + 400 }, 700, createjs.Ease.backOut);
            this.gameView.addChild(restart);
            restart.addEventListener("mousedown", function (ev) {
                window.location.href = "index.html";
            });
        }

        // 倒计时
    }, {
        key: "fCountTime",
        value: function fCountTime() {
            var _this2 = this;

            var text_sum = new createjs.Text(this.nTimeCount, "20px Arial", "#ffffff");
            text_sum.x = 1227;
            text_sum.y = 9;
            text_sum.textAlign = "center";
            this.gameView.addChild(text_sum);
            window.upSteTimeOut = setTimeout(function () {
                if (_this2.nTimeCount > 0) {
                    _this2.nTimeCount--;
                    text_sum.text = _this2.nTimeCount;
                    _this2.gameView.removeChild(text_sum);
                    _this2.fCountTime();
                } else {
                    window.clearInterval(window.upSteTimeOut);
                    _this2.reset();
                    _this2.killScore();
                }
            }, 1000);
        }
    }, {
        key: "Layout",
        value: function Layout() {
            var _this3 = this;

            var timer, getHero, insect, redImgHero, sgBtns, scBtns, pjBtns;
            var heroContainer = new createjs.Container();
            window.currentIndex = babyEye.randomRange(1, 7);
            getHero = window.queue.getResult(currentIndex);
            insect = new createjs.Bitmap(getHero);
            insect.scaleX = insect.scaleY = ceil;
            insect.regX = 148;
            insect.regY = 28;
            heroContainer.addChild(insect);
            heroContainer.x = this.width / 2;
            heroContainer.y = this.height / 6;
            this.gameView.addChild(heroContainer);
            //3按钮
            sgBtns = new createjs.Bitmap(window.queue.getResult("sgBtn"));
            sgBtns.x = 850;
            sgBtns.y = 300;
            this.gameView.addChild(sgBtns);
            //1按钮
            scBtns = new createjs.Bitmap(window.queue.getResult("scBtn"));
            scBtns.x = 320;
            scBtns.y = 320;
            this.gameView.addChild(scBtns);
            //2按钮
            pjBtns = new createjs.Bitmap(window.queue.getResult("pjBtn"));
            pjBtns.x = 580;
            pjBtns.y = 260;
            this.gameView.addChild(pjBtns);

            this.timer = new createjs.Bitmap(window.queue.getResult("timer"));
            this.timer.x = 1139;
            this.timer.y = 4;
            this.gameView.addChild(this.timer);

            if (window.currentIndex == 5 || window.currentIndex == 6) {
                scBtns.addEventListener("mousedown", function (ev) {
                    _this3.gameView.removeChild(heroContainer);
                    console.log(window.score);
                    _this3.builderSuccess();
                });
            } else {
                scBtns.addEventListener("mousedown", function (ev) {
                    heroContainer.scaleX = heroContainer.scaleY + 0.1;
                    _this3.buildrFail();
                });
            }
            //3判断
            if (window.currentIndex == 3 || window.currentIndex == 2) {
                sgBtns.addEventListener("mousedown", function (ev) {
                    _this3.gameView.removeChild(heroContainer);
                    _this3.builderSuccess();
                });
            } else {
                sgBtns.addEventListener("mousedown", function (ev) {
                    heroContainer.scaleX = heroContainer.scaleY + 0.1;
                    _this3.buildrFail();
                });
            }
            //2判断
            if (window.currentIndex == 1 || window.currentIndex == 4) {
                pjBtns.addEventListener("mousedown", function (ev) {
                    _this3.gameView.removeChild(heroContainer);
                    _this3.builderSuccess();
                });
            } else {
                pjBtns.addEventListener("mousedown", function (ev) {
                    heroContainer.scaleX = heroContainer.scaleY + 0.1;
                    _this3.buildrFail();
                });
            }
        }
    }, {
        key: "builderSuccess",
        value: function builderSuccess() {
            //视标缩放代码算法
            if (ceil == 0.10000000000000014) {
                // 0.20000000000000015
                ceil = ceil - 0.3;
                ceil += 0.3;
            } else {
                ceil = ceil - 0.1;
            }
            //分数成绩代码算法  
            if (window.score < 100) {
                window.score = window.score + 10;
                window.speed = window.speed + 0.02;
            } else if (window.score == 100) {
                window.score = 100;
            }
            this.success(); //你真棒
            window.clearInterval(window.upSteTimeOut); //清除倒计时
            this.reset(); //清除画布所有内容
            this.firstScreen(); //画布刷新
        }
    }, {
        key: "buildrFail",
        value: function buildrFail() {
            window.speed = window.speed - 0.1;
            this.fail();
            if (window.score <= 0) {
                window.score = 0;
            } else {
                window.score = window.score - 10;
            }
            window.clearInterval(window.upSteTimeOut);
            this.reset();
            this.firstScreen();
        }
    }, {
        key: "success",
        value: function success() {
            createjs.Sound.play("nzb", createjs.Sound.INTERRUPT_NONE, 0, 0, 0, 1, 0);
            $("#sucImg").show(500);
            $("#sucImg").hide(500);
        }
    }, {
        key: "fail",
        value: function fail() {
            createjs.Sound.play("noMuc", createjs.Sound.INTERRUPT_NONE, 0, 0, 0, 1, 0);
            $("#failImg").show(500);
            $("#failImg").hide(500);
        }
    }, {
        key: "reset",
        value: function reset() {
            this.stage.removeAllChildren();
            this.stage.removeAllEventListeners();
        }
    }, {
        key: "gamebg",
        value: function gamebg() {
            var gamebg = window.queue.getResult("gamebg");
            var gamebgs = new createjs.Bitmap(gamebg);
            gamebgs.x = 0;
            gamebgs.y = 20;
            this.gameView.addChild(gamebgs);
        }
    }, {
        key: "bgMain",
        value: function bgMain() {
            if (ceil == 1) {
                this.canvasBgeight();
            } else if (ceil == 0.9 && ceil == 0.8) {
                this.canvasBgseven();
            } else if (ceil == 0.7000000000000001) {
                this.canvasBgsix();
            } else if (ceil == 0.6000000000000001) {
                this.canvasBgfive();
            } else if (ceil == 0.5000000000000001) {
                this.canvasBgfour();
            } else if (ceil == 0.40000000000000013) {
                this.canvasBgthree();
            } else if (ceil == 0.30000000000000016 && ceil == 0.20000000000000015) {
                this.canvasBgtwo();
            } else if (ceil == 0.10000000000000014) {
                this.canvasBgone();
            }
        }
    }, {
        key: "canvasBgone",
        value: function canvasBgone() {
            var config = {
                barWidth: 5,
                deltaTime: 400,
                showTimes: 8
            };
            console.log(1);
            if (window.stbg) stbg.removeSelf();
            window.stbg = new STBG(config);
        }
    }, {
        key: "canvasBgtwo",
        value: function canvasBgtwo() {
            var config = {
                barWidth: 10,
                deltaTime: 400,
                showTimes: 8
            };
            console.log(2);
            if (window.stbg) stbg.removeSelf();
            window.stbg = new STBG(config);
        }
    }, {
        key: "canvasBgthree",
        value: function canvasBgthree() {
            var config = {
                barWidth: 15,
                deltaTime: 400,
                showTimes: 8
            };
            console.log(3);
            if (window.stbg) stbg.removeSelf();
            window.stbg = new STBG(config);
        }
    }, {
        key: "canvasBgfour",
        value: function canvasBgfour() {
            var config = {
                barWidth: 20,
                deltaTime: 400,
                showTimes: 8
            };
            console.log(4);
            if (window.stbg) stbg.removeSelf();
            window.stbg = new STBG(config);
        }
    }, {
        key: "canvasBgfive",
        value: function canvasBgfive() {
            var config = {
                barWidth: 25,
                deltaTime: 400,
                showTimes: 8
            };
            console.log(5);
            if (window.stbg) stbg.removeSelf();
            window.stbg = new STBG(config);
        }
    }, {
        key: "canvasBgsix",
        value: function canvasBgsix() {
            var config = {
                barWidth: 30,
                deltaTime: 400,
                showTimes: 8
            };
            console.log(6);
            if (window.stbg) stbg.removeSelf();
            window.stbg = new STBG(config);
        }
    }, {
        key: "canvasBgseven",
        value: function canvasBgseven() {
            var config = {
                barWidth: 35,
                deltaTime: 400,
                showTimes: 8
            };
            console.log(7);
            if (window.stbg) stbg.removeSelf();
            window.stbg = new STBG(config);
        }
    }, {
        key: "canvasBgeight",
        value: function canvasBgeight() {
            var config = {
                barWidth: 40,
                deltaTime: 400,
                showTimes: 8
            };
            console.log(8);
            if (window.stbg) stbg.removeSelf();
            window.stbg = new STBG(config);
        }
    }]);

    return Game;
})();