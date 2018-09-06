"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(window).ready(function () {
    var BloomBG = function () {
        function BloomBG(config) {
            _classCallCheck(this, BloomBG);

            this.colors = config.colors;
            this.time = config.time;
            this.canvasID = config.canvasID;
            this.stage = new createjs.Stage(this.canvasID);
            this.stage.autoClear = false;
            this.pauseValue = false;
            this.stapValue = false;
            this.buildContent();
            this.render();
        }

        _createClass(BloomBG, [{
            key: "buildContent",
            value: function buildContent() {
                this.flower = new createjs.Shape();
                this.fillCmd = this.flower.graphics.beginFill(this.colors[0]).command;
                this.flower.graphics.drawPolyStar(0, 0, 300, 12, 0.85);
                this.flower.set({
                    x: this.stage.canvas.width / 2,
                    y: this.stage.canvas.height / 2
                });

                this.stage.addChild(this.flower);

                var t = createjs.Tween.get(this.fillCmd, { loop: true, bounce: true });

                for (var i = 1; i < this.colors.length; i++) {
                    t.to({ style: this.colors[i] }, this.time);
                }

                createjs.Tween.get(this.flower, { loop: true, bounce: true }).to({ alpha: 0.3, scaleX: 0.2, scaleY: 0.2 }).to({ rotation: 360, scaleX: 3, scaleY: 3 }, 3300, createjs.Ease.quadInOut);
            }
        }, {
            key: "render",
            value: function render() {
                var _this = this;

                this.stage.update();
                if (this.stopValue || this.pauseValue) return;

                window.requestAnimationFrame(function () {
                    _this.render();
                });
            }
        }, {
            key: "stop",
            value: function stop() {
                this.stopValue = true;
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
            key: "removeSelf",
            value: function removeSelf() {
                this.stop();
                this.stage.autoClear = true;
                this.stage.removeAllChildren();
                this.stage.removeAllEventListeners();
                this.stage.update();
            }
        }]);

        return BloomBG;
    }();

    window.BloomBG = BloomBG;
});