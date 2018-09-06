"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(window).ready(function () {
    var MergePatternBG = (function () {
        function MergePatternBG(images) {
            _classCallCheck(this, MergePatternBG);

            this.stage = new createjs.Stage("bg-canvas");
            this.stage.compositeOperation = "darken";
            this.width = this.stage.canvas.width;
            this.height = this.stage.canvas.height;
            this.lastFrame = 0;
            this.lastBuildTarget = 0;
            this.runningTime = 0;
            this.targets = [];
            this.toRemove = [];
            if (images && images.length != 0) {
                this.images = images;
                this.buildBitmaps();
            }
            this.buildView();
            this.render();
        }

        _createClass(MergePatternBG, [{
            key: "removeSelf",
            value: function removeSelf() {
                this.stop = true;
                this.stage.removeAllChildren();
                this.stage.update();
            }
        }, {
            key: "buildBitmaps",
            value: function buildBitmaps() {
                var _this = this;

                this.bitmaps = [];
                this.images.forEach(function (image) {
                    var blueImage = new babyEye.ImageFiltered(image, [babyEye.blueFilter]);
                    var redImage = new babyEye.ImageFiltered(image, [babyEye.redFilter]);

                    var redBitmap = new createjs.Bitmap(redImage);
                    var blueBitmap = new createjs.Bitmap(blueImage);

                    redBitmap.regX = blueBitmap.regX = image.width / 2;
                    redBitmap.regY = blueBitmap.regY = image.width / 2;

                    _this.bitmaps.push({
                        red: redBitmap,
                        blue: blueBitmap
                    });
                });
            }
        }, {
            key: "render",
            value: function render() {
                var _this2 = this;

                var stamp = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

                if (this.stop) return;
                var dt = stamp - this.lastFrame;
                if (dt > 150) dt = 0;
                this.lastFrame = stamp;

                this.update(dt);
                this.stage.update();

                window.requestAnimationFrame(function (stamp) {
                    _this2.render(stamp);
                });
            }
        }, {
            key: "update",
            value: function update(dt) {
                this.runningTime += dt;

                if (this.runningTime - this.lastBuildTarget > 100) {
                    this.lastBuildTarget = this.runningTime;
                    this.buildTarget();
                }

                this.targets.forEach(function (target) {
                    target.update(dt);
                });

                this.toRemove.forEach(function (item) {
                    item.removeSelf();
                });
            }
        }, {
            key: "buildView",
            value: function buildView() {
                this.view = new createjs.Container();
                this.view.set({
                    regX: this.width / 2,
                    regY: this.height / 2,
                    x: this.width / 2,
                    y: this.height / 2
                });
                this.stage.addChild(this.view);
            }
        }, {
            key: "buildTarget",
            value: function buildTarget() {
                var target = new Target({
                    bg: this,
                    bitmapCouple: this.bitmaps && this.bitmaps[0]
                });
                this.view.addChild(target.view);
                this.targets.push(target);
            }
        }]);

        return MergePatternBG;
    })();

    var Target = (function () {
        function Target(config) {
            _classCallCheck(this, Target);

            this.bg = config.bg;
            this.bitmapCouple = config.bitmapCouple;
            this.v = 2;
            this.delta = 20;
            this.moveTime = 2000;
            this.setVelocity();
            this.buildView();
        }

        _createClass(Target, [{
            key: "update",
            value: function update(dt) {
                this.view.x += this.vx;
                this.view.y += this.vy;
                this.view.scaleX += 0.0002 * dt;
                this.view.scaleY = this.view.scaleX;

                if (this.checkOutBounds()) {
                    this.bg.toRemove.push(this);
                }
            }
        }, {
            key: "checkOutBounds",
            value: function checkOutBounds() {
                return this.view.x > this.bg.width || this.view.x < 0 || this.view.y > this.bg.width || this.view.y < 0;
            }
        }, {
            key: "setVelocity",
            value: function setVelocity() {
                var theta = Math.random() * Math.PI * 2;
                this.vx = this.v * Math.cos(theta);
                this.vy = this.v * Math.sin(theta);
            }
        }, {
            key: "buildView",
            value: function buildView() {
                this.view = new createjs.Container();
                if (this.bitmapCouple) {
                    this.left = this.bitmapCouple.red.clone();
                    this.right = this.bitmapCouple.blue.clone();
                } else {
                    this.left = new createjs.Shape();
                    this.left.graphics.f("red").dc(0, 0, 20);
                    this.right = new createjs.Shape();
                    this.right.graphics.f("blue").dc(0, 0, 20);
                }
                this.right.set({ x: this.delta });
                this.left.set({ x: -this.delta });

                createjs.Tween.get(this.left, { "loop": true }).to({ x: this.delta }, this.moveTime).to({ x: -this.delta }, this.moveTime);

                createjs.Tween.get(this.right, { "loop": true }).to({ x: -this.delta }, this.moveTime).to({ x: this.delta }, this.moveTime);

                this.view.addChild(this.left, this.right);
                // if(this.bitmapCouple){
                //     this.view.set({scaleX: 2/this.bitmapCouple.red.image.width, scaleY: 2/this.bitmapCouple.red.image.height});
                // } else {
                // this.view.set({scaleX: 0.2, scaleY: 0.2});
                // }
                this.view.set({ x: this.bg.width * 0.5, y: this.bg.height * 0.5, scaleX: 0.2, scaleY: 0.2 });
            }
        }, {
            key: "removeSelf",
            value: function removeSelf() {
                var index = this.bg.targets.indexOf(this);
                if (index != -1) {
                    createjs.Tween.removeTweens(this.left);
                    createjs.Tween.removeTweens(this.right);
                    this.view.parent.removeChild(this.view);
                    this.bg.targets.splice(index, 1);
                }
            }
        }]);

        return Target;
    })();

    window.MergePatternBG = MergePatternBG;
});