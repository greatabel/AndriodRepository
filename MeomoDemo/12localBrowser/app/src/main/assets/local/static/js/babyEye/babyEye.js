"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(window).ready(function () {
    if (!Object.assign) {
        Object.assign = function (target, source) {
            for (var p in source) {
                target[p] = source[p];
            }
        };
    }
    if (!window.babyEye) {
        window.babyEye = {};
    }
    babyEye.anTarget = function (bg, lazy, glasses) {
        return bg ^ lazy ^ glasses;
    };

    babyEye.steInOut = function (bg, target, glasses) {
        return bg ^ target ^ glasses;
    };

    window.anTarget = babyEye.anTarget;
    window.steInOut = babyEye.steInOut;

    babyEye.redFilter = new createjs.ColorFilter(1, 0, 0, 1, 255, 0, 0, 0);
    babyEye.blueFilter = new createjs.ColorFilter(0, 0, 1, 1, 0, 0, 255, 0);

    babyEye.getParam = function (url, name) {
        if (url.indexOf("?") == -1) return null;
        var value = null;
        var params = url.split("?")[1].split('&').forEach(function (param) {
            if (param.split('=')[0] == name) {
                value = param.split('=')[1];
            }
        });
        return value;
    };

    babyEye.average = function (arr) {
        var l = arr.length;
        var sum = arr.reduce(function (x, y) {
            return x + y;
        }, 0);
        return sum / l;
    };

    babyEye.distance = function (x1, y1, x2, y2) {
        var dx = Math.abs(x1 - x2);
        var dy = Math.abs(y1 - y2);
        return Math.sqrt(dx * dx + dy * dy);
    };

    babyEye.pointDistance = function (p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    };

    babyEye.disSquare = function (x1, y1, x2, y2) {
        return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
    };

    babyEye.randomRange = function (low, high) {
        return Math.floor(low + Math.random() * (high - low));
    };

    babyEye.randomExcept = function (low, high, except) {
        var result = babyEye.randomRange(low, high);
        return result == except ? babyEye.randomExcept(low, high, except) : result;
    };

    babyEye.shuffle = function (arr) {
        var i = 0;
        while (i < arr.length) {
            var j = babyEye.randomRange(0, i);
            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            i++;
        }
    };

    babyEye.randomChoice = function (arr) {
        return arr[babyEye.randomRange(0, arr.length)];
    };

    //([1,2,3,4,5], 2) -> [[1,2],[3,4],[5]];
    babyEye.bundle = function (arr, n) {
        var result = [];
        for (var i = 0; i < arr.length; i = i + n) {
            result.push(arr.slice(i, i + n));
        }
        return result;
    };

    babyEye.reversed = function (arr) {
        var result = [];
        for (var i = arr.length - 1; i >= 0; i--) {
            result.push(arr[i]);
        }
        return result;
    };

    babyEye.inRange = function (point, range) {
        return range[0] < point && point < range[1];
    };

    babyEye.rangeArr = function (min, max) {
        var step = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

        var arr = [];
        for (var i = min; i < max; i += step) {
            arr.push(i);
        }
        return arr;
    };

    babyEye.constrain = function (value, min, max) {
        if (value > max) {
            return max;
        } else if (value < min) {
            return min;
        } else {
            return value;
        }
    };

    babyEye.map = function (value, minSource, maxSource, minTarget, maxTarget) {
        var deltaResource = maxSource - minSource;
        var deltaTarget = maxTarget - minTarget;
        var result = minTarget + value / deltaResource * deltaTarget;
        return babyEye.constrain(result, minTarget, maxTarget);
    };

    babyEye.selectFrom = function (arr) {
        var num = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

        if (arr.length < num) throw new Error("the array is too small");
        var copy = [],
            result = [];
        Object.assign(copy, arr);
        while (result.length < num) {
            var index = babyEye.randomRange(0, copy.length);
            var selected = copy.splice(index, 1)[0];
            result.push(selected);
        }
        return result;
    };

    var Vec2 = function () {
        function Vec2() {
            var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            _classCallCheck(this, Vec2);

            this.x = x;
            this.y = y;
        }

        _createClass(Vec2, [{
            key: "set",
            value: function set(x, y) {
                this.x = x;
                this.y = y;
            }
        }, {
            key: "add",
            value: function add(v) {
                this.x += v.x;
                this.y += v.y;
            }
        }, {
            key: "sub",
            value: function sub(v) {
                this.x -= v.x;
                this.y -= v.y;
            }
        }, {
            key: "mult",
            value: function mult(m) {
                this.x *= m;
                this.y *= m;
            }
        }, {
            key: "div",
            value: function div(m) {
                this.x /= m;
                this.y /= m;
            }
        }, {
            key: "normalize",
            value: function normalize() {
                var m = this.mag();
                if (m == 0) m = 1;
                this.x /= m;
                this.y /= m;
            }
        }, {
            key: "mag",
            value: function mag() {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            }
        }, {
            key: "limit",
            value: function limit(n) {
                var m = this.mag();
                if (m > n) {
                    this.normalize();
                    this.mult(n);
                }
            }
        }, {
            key: "heading",
            value: function heading() {
                return Math.atan2(this.y, this.x) * 180 * 0.31831; //180/Math.PI;
            }
        }, {
            key: "neg",
            value: function neg() {
                this.x = -this.x;
                this.y = -this.y;
            }
        }, {
            key: "get",
            value: function get() {
                return new Vec2(this.x, this.y);
            }
        }], [{
            key: "dot",
            value: function dot(v1, v2) {
                return this.x * v.x + this.y * v.y;
            }
        }, {
            key: "distance",
            value: function distance(v1, v2) {
                return Vec2.sub(v2, v1).mag();
            }
        }, {
            key: "add",
            value: function add(v1, v2) {
                return new Vec2(v1.x + v2.x, v1.y + v2.y);
            }
        }, {
            key: "sub",
            value: function sub(v1, v2) {
                return new Vec2(v1.x - v2.x, v1.y - v2.y);
            }
        }, {
            key: "mult",
            value: function mult(v, m) {
                return new Vec2(v.x * m, v.y * m);
            }
        }, {
            key: "div",
            value: function div(v, m) {
                return new Vec2(v.x / m, v.y / m);
            }
        }]);

        return Vec2;
    }();

    babyEye.Vec2 = Vec2;

    // 缓慢画线
    // let config = {
    //     shape: target,
    //     points: [new c.Point(0,0), new c.Point(400,300), new c.Point(-50,300), new c.Point(0,0)],
    //     color: "red",
    //     strokeStyle: [10, "round"],
    //     speed: 0.8,
    //     finalFill: true,//  可选
    //     fillColor: "blue",// 可选
    //     onComplete: ()=>{console.log("complete!")},//可选
    //     onChange: (ltCmd)=>{console.log(ltCmd)}, //可选
    // }
    // babyEye.animateDraw(config);
    babyEye.animateDraw = function (config) {
        var _shape$graphics$s;

        var hidden = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var shape = config.shape,
            points = config.points,
            color = config.color,
            strokeStyle = config.strokeStyle,
            speed = config.speed;

        var g = (_shape$graphics$s = shape.graphics.s(color)).ss.apply(_shape$graphics$s, _toConsumableArray(strokeStyle)).mt(points[0].x, points[0].y);
        var cmd = g.lt(points[0].x, points[0].y).command;
        var time = babyEye.pointDistance(points[0], points[1]) * (1 / speed);
        var tween = createjs.Tween.get(cmd).to({ x: points[1].x, y: points[1].y }, time);

        if (config.onChange) tween.on("change", function () {
            config.onChange(cmd);
        });
        tween.call(function () {
            if (points.length < 3) {
                if (!config.finalFill) return;
                points = hidden.concat(points);
                points.forEach(function (point, index) {
                    if (index == 0) {
                        var fc = config.fillColor ? config.fillColor : color;
                        g.f(fc).mt(point.x, point.y);
                    } else {
                        g.lt(point.x, point.y);
                    }
                });
                if (config.onComplete) config.onComplete();
                return;
            }
            hidden.push(points.shift());
            babyEye.animateDraw(config, hidden);
        });
    };

    //new ImageSTE({image:xxx, colors:["r","b"], delta:10}) -> image;

    var ImageSTE = function ImageSTE(config) {
        _classCallCheck(this, ImageSTE);

        if (config.colors.indexOf("r") == -1) {
            console.log("参数错了");
            return;
        }
        var img = config.image;
        var colors = config.colors;
        var delta = config.delta;
        var canvas = document.getElementById("img-canvas");
        canvas.width = img.width + delta;
        canvas.height = img.height;

        var ctx = canvas.getContext('2d');
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, colors[0] == "r" ? 0 : delta, 0);
        var imageDataLeft = ctx.getImageData(0, 0, img.width + delta, img.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, colors[0] == "r" ? delta : 0, 0);
        var imageDataRight = ctx.getImageData(0, 0, img.width + delta, img.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var result = ctx.createImageData(img.width + delta, img.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var dataLength = imageDataRight.data.length;

        if (config.type == 2) {
            for (var i = 0; i < dataLength; i += 4) {
                imageDataRight.data[i] = 0;
                imageDataLeft.data[i + 1] = 0;
            }
        } else {
            for (var _i = 0; _i < dataLength; _i += 4) {
                imageDataRight.data[_i] = 0;
            }
        }

        for (var _i2 = 0; _i2 < dataLength; _i2 += 4) {
            imageDataLeft.data[_i2 + 1] = 0;
            imageDataLeft.data[_i2 + 2] = 0;
        }

        for (var _i3 = 0; _i3 < dataLength; _i3 += 4) {
            result.data[_i3] = imageDataLeft.data[_i3];
            result.data[_i3 + 1] = imageDataRight.data[_i3 + 1];
            result.data[_i3 + 2] = imageDataRight.data[_i3 + 2];
            result.data[_i3 + 3] = imageDataRight.data[_i3 + 3] + imageDataLeft.data[_i3 + 3];
        }
        ctx.putImageData(result, 0, 0);

        var imgDom = document.createElement("img");
        imgDom.src = canvas.toDataURL("image/png");
        imgDom.width = img.width + delta;
        imgDom.height = img.height;
        return imgDom;
    };

    babyEye.ImageSTE = ImageSTE;

    var ImageSTE2 = function ImageSTE2(config) {
        _classCallCheck(this, ImageSTE2);

        config.type = 2;
        return new ImageSTE(config);
    };

    babyEye.ImageSTE2 = ImageSTE2;

    //只取中间像素

    var ImageMidSTE = function ImageMidSTE(config) {
        _classCallCheck(this, ImageMidSTE);

        if (config.colors.indexOf("r") == -1) {
            console.log("参数错了");
            return;
        }
        var img = config.image;
        var colors = config.colors;
        var delta = config.delta;
        var canvas = document.getElementById("img-canvas");
        canvas.width = img.width + delta;
        canvas.height = img.height;

        var ctx = canvas.getContext('2d');
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, colors[0] == "r" ? 0 : delta, 0);
        var imageDataLeft = ctx.getImageData(0, 0, img.width + delta, img.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, colors[0] == "r" ? delta : 0, 0);
        var imageDataRight = ctx.getImageData(0, 0, img.width + delta, img.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var result = ctx.createImageData(img.width + delta, img.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var dataLength = imageDataRight.data.length;
        for (var i = 0; i < dataLength; i += 4) {
            imageDataRight.data[i] = 0;
        }

        for (var _i4 = 0; _i4 < dataLength; _i4 += 4) {
            imageDataLeft.data[_i4 + 1] = 0;
            imageDataLeft.data[_i4 + 2] = 0;
        }

        for (var _i5 = 0; _i5 < dataLength; _i5 += 4) {
            result.data[_i5] = imageDataLeft.data[_i5];
            result.data[_i5 + 1] = imageDataRight.data[_i5 + 1];
            result.data[_i5 + 2] = imageDataRight.data[_i5 + 2];
            result.data[_i5 + 3] = imageDataRight.data[_i5 + 3] && imageDataLeft.data[_i5 + 3];
        }
        ctx.putImageData(result, 0, 0);

        var imgDom = document.createElement("img");
        imgDom.src = canvas.toDataURL("image/png");
        imgDom.width = img.width + delta;
        imgDom.height = img.height;
        return imgDom;
    };

    babyEye.ImageMidSTE = ImageMidSTE;

    var FilteredImg = function FilteredImg(originalImg, filters) {
        _classCallCheck(this, FilteredImg);

        this.canvas = document.getElementById("img-canvas");
        this.canvas.width = originalImg.width;
        this.canvas.height = originalImg.height;

        this.stage = new createjs.Stage("img-canvas");
        this.stage.update();

        this.bitmap = new createjs.Bitmap(originalImg);
        this.bitmap.filters = filters;
        this.bitmap.cache(0, 0, originalImg.width, originalImg.height);
        this.stage.addChild(this.bitmap);
        this.stage.update();

        var result = document.createElement("img"); // Create an <img> element
        result.src = this.canvas.toDataURL(); // Set its src attribute
        result.width = originalImg.width;
        result.height = originalImg.height;
        return result;
    };

    babyEye.FilteredImg = FilteredImg;
    babyEye.ImageFiltered = FilteredImg;

    var Button = function (_c$Bitmap) {
        _inherits(Button, _c$Bitmap);

        function Button(id, param1, param2) {
            _classCallCheck(this, Button);

            //fuck 以前写的烂，为了兼容已经使用的；
            //id,callback
            //id,resourceQueue, callback
            var resourceQueue = void 0,
                callback = void 0,
                img = void 0;

            if (arguments.length == 2) {
                callback = param1;
                img = window.queue.getResult(id);
            } else if (arguments.length == 3) {
                resourceQueue = param1;
                callback = param2;
                img = resourceQueue.getResult(id);
            }

            var _this = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this, img));

            if (arguments.length == 3) _this.cursor = "pointer";
            _this.addEventListener("mousedown", function (ev) {
                ev.stopPropagation();
                callback(id);
            });

            _this.regX = img.width / 2;
            _this.regY = img.height / 2;
            return _this;
        }

        return Button;
    }(c.Bitmap);

    babyEye.Button = Button;

    var ImageButton = function (_createjs$Bitmap) {
        _inherits(ImageButton, _createjs$Bitmap);

        function ImageButton(img, callback) {
            _classCallCheck(this, ImageButton);

            var _this2 = _possibleConstructorReturn(this, (ImageButton.__proto__ || Object.getPrototypeOf(ImageButton)).call(this, img));

            if (callback) {
                _this2.addEventListener("mousedown", function (ev) {
                    ev.stopPropagation();
                    callback();
                });
            }

            _this2.regX = img.width / 2;
            _this2.regY = img.height / 2;
            return _this2;
        }

        return ImageButton;
    }(createjs.Bitmap);

    babyEye.ImageButton = ImageButton;

    var InteractiveButton = function (_createjs$Container) {
        _inherits(InteractiveButton, _createjs$Container);

        function InteractiveButton(imgNormal, imgHover, callback) {
            _classCallCheck(this, InteractiveButton);

            var _this3 = _possibleConstructorReturn(this, (InteractiveButton.__proto__ || Object.getPrototypeOf(InteractiveButton)).call(this));

            _this3.callback = callback;
            _this3.viewNormal = new createjs.Bitmap(imgNormal);
            _this3.viewHover = new createjs.Bitmap(imgHover);
            _this3.viewHover.visible = false;
            _this3.hovering = false;
            _this3.cursor = "pointer";
            _this3.addChild(_this3.viewNormal, _this3.viewHover);
            _this3.events();
            return _this3;
        }

        _createClass(InteractiveButton, [{
            key: "events",
            value: function events() {
                var _this4 = this;

                this.addEventListener("mouseover", function () {
                    _this4.viewHover.visible = true;
                    if (_this4.viewNormal.stage) _this4.viewNormal.stage.update();
                });

                this.addEventListener("mouseout", function () {
                    _this4.viewHover.visible = false;
                    if (_this4.viewNormal.stage) _this4.viewNormal.stage.update();
                });

                this.addEventListener("mousedown", function (ev) {
                    ev.stopPropagation();
                    _this4.callback();
                });
            }
        }]);

        return InteractiveButton;
    }(createjs.Container);

    babyEye.InteractiveButton = InteractiveButton;

    var ReplayButton = function (_InteractiveButton) {
        _inherits(ReplayButton, _InteractiveButton);

        function ReplayButton(callback) {
            _classCallCheck(this, ReplayButton);

            var callbackNew = function callbackNew() {
                if (window.game && window.game.stage) window.game.stage.enableMouseOver(0);
                callback();
            };

            var _this5 = _possibleConstructorReturn(this, (ReplayButton.__proto__ || Object.getPrototypeOf(ReplayButton)).call(this, babyEye.prepareTrainQueue.getResult("replay-text"), babyEye.prepareTrainQueue.getResult("replay"), callbackNew));

            _this5.set({ x: 10, y: 5 });
            return _this5;
        }

        return ReplayButton;
    }(InteractiveButton);

    babyEye.ReplayButton = ReplayButton;

    var HelpButton = function (_InteractiveButton2) {
        _inherits(HelpButton, _InteractiveButton2);

        function HelpButton(config) {
            _classCallCheck(this, HelpButton);

            var callback = function callback() {
                if (window.game.pause) window.game.pause();
                var showInstructionConfig = {
                    calledByHelp: true,
                    instruction: config.instruction,
                    staticPath: config.staticPath,
                    instructionItems: config.instructionItems,
                    fontSizeDelta: config.fontSizeDelta, //文字大小控制，默认0
                    lineHeightDelta: config.lineHeightDelta, //行距控制，默认0
                    language: config.language, //"zh"中文 "en"英文, 默认中文
                    callback: function callback() {
                        if (window.game.continue) window.game.continue();
                    }
                };
                babyEye.prepareTrain(showInstructionConfig);
            };

            var _this6 = _possibleConstructorReturn(this, (HelpButton.__proto__ || Object.getPrototypeOf(HelpButton)).call(this, babyEye.prepareTrainQueue.getResult("help-text"), babyEye.prepareTrainQueue.getResult("help"), callback));

            _this6.set({ x: 90, y: 5 });
            return _this6;
        }

        return HelpButton;
    }(InteractiveButton);

    babyEye.HelpButton = HelpButton;

    var Bitmap = function (_createjs$Bitmap2) {
        _inherits(Bitmap, _createjs$Bitmap2);

        function Bitmap(img) {
            _classCallCheck(this, Bitmap);

            var _this7 = _possibleConstructorReturn(this, (Bitmap.__proto__ || Object.getPrototypeOf(Bitmap)).call(this, img));

            _this7.regX = img.width / 2;
            _this7.regY = img.height / 2;
            return _this7;
        }

        return Bitmap;
    }(createjs.Bitmap);

    babyEye.Bitmap = Bitmap;

    var CountDown = function () {
        function CountDown(config) {
            _classCallCheck(this, CountDown);

            this.duration = config.duration;
            this.callback = config.callback;
            this.termination = false;
            this.current = 0;
            this.lastUpdateView = 0;
            this.buildView();
            this.updateView();
        }

        _createClass(CountDown, [{
            key: "update",
            value: function update(dt) {
                if (this.termination) return;
                this.current += dt;
                if (this.current - this.lastUpdateView > 1000) {
                    this.lastUpdateView = this.current;
                    this.updateView();
                }

                if (this.current > this.duration) {
                    this.termination = true;
                    this.textTime.text = "00:00";
                    this.callback();
                }
            }
        }, {
            key: "buildView",
            value: function buildView() {
                this.view = new createjs.Container();
                this.view.set({ x: 1050, y: 5 });
                var img = babyEye.prepareTrainQueue.getResult("count-down");
                var bg = new createjs.Bitmap(img);
                this.textTime = new createjs.Text("", "28px fantasy", "white");
                this.textTime.set({ textAlign: "center", x: 160, y: 15 });
                this.view.addChild(bg, this.textTime);
            }
        }, {
            key: "updateView",
            value: function updateView() {
                this.remain = ((this.duration - this.current) * 0.001).toFixed(0);
                var minutes = Math.floor(this.remain / 60).toString();
                var seconds = (this.remain % 60).toFixed(0);
                if (minutes.length == 1) minutes = "0" + minutes;
                if (seconds.length == 1) seconds = "0" + seconds;
                this.textTime.text = minutes + ":" + seconds;
            }
        }]);

        return CountDown;
    }();

    babyEye.CountDown = CountDown;

    var NumericType = function () {
        function NumericType() {
            var initValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var minValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -Infinity;
            var maxValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;

            _classCallCheck(this, NumericType);

            this.value = initValue;
            this.minValue = minValue;
            this.maxValue = maxValue;
        }

        _createClass(NumericType, [{
            key: "buildView",
            value: function buildView(id) {
                this.view = new createjs.Container();
                this.view.set({ x: 1050, y: 5 });
                var img = babyEye.prepareTrainQueue.getResult(id);
                var bg = new createjs.Bitmap(img);
                this.text = new createjs.Text(this.value, "28px fantasy", "white");
                this.text.set({ textAlign: "center", x: 150, y: 15 });
                this.view.addChild(bg, this.text);
            }
        }, {
            key: "changeValue",
            value: function changeValue(value) {
                this.setValue(this.value + value);
            }
        }, {
            key: "setValue",
            value: function setValue(value) {
                if (this.minValue <= value && value <= this.maxValue) {
                    this.value = value;
                    this.text.text = this.value;
                }
            }
        }]);

        return NumericType;
    }();

    var Level = function (_NumericType) {
        _inherits(Level, _NumericType);

        function Level() {
            var initValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
            var minValue = arguments[1];
            var maxValue = arguments[2];

            _classCallCheck(this, Level);

            var _this8 = _possibleConstructorReturn(this, (Level.__proto__ || Object.getPrototypeOf(Level)).call(this, initValue, minValue, maxValue));

            _this8.buildView("level");
            return _this8;
        }

        return Level;
    }(NumericType);

    babyEye.Level = Level;

    var Score = function (_NumericType2) {
        _inherits(Score, _NumericType2);

        function Score() {
            var initValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var minValue = arguments[1];
            var maxValue = arguments[2];

            _classCallCheck(this, Score);

            var _this9 = _possibleConstructorReturn(this, (Score.__proto__ || Object.getPrototypeOf(Score)).call(this, initValue, minValue, maxValue));

            _this9.buildView("score");
            return _this9;
        }

        return Score;
    }(NumericType);

    babyEye.Score = Score;

    var Remain = function (_NumericType3) {
        _inherits(Remain, _NumericType3);

        function Remain() {
            var initValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
            var minValue = arguments[1];
            var maxValue = arguments[2];

            _classCallCheck(this, Remain);

            var _this10 = _possibleConstructorReturn(this, (Remain.__proto__ || Object.getPrototypeOf(Remain)).call(this, initValue, minValue, maxValue));

            _this10.buildView("remain");
            return _this10;
        }

        return Remain;
    }(NumericType);

    babyEye.Remain = Remain;

    var Travel = function (_NumericType4) {
        _inherits(Travel, _NumericType4);

        function Travel() {
            var initValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var minValue = arguments[1];
            var maxValue = arguments[2];

            _classCallCheck(this, Travel);

            var _this11 = _possibleConstructorReturn(this, (Travel.__proto__ || Object.getPrototypeOf(Travel)).call(this, initValue, minValue, maxValue));

            _this11.buildView("travel");
            _this11.text.x = 120;
            return _this11;
        }

        return Travel;
    }(NumericType);

    babyEye.Travel = Travel;

    var SkiTravel = function (_NumericType5) {
        _inherits(SkiTravel, _NumericType5);

        function SkiTravel() {
            var initValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var minValue = arguments[1];
            var maxValue = arguments[2];

            _classCallCheck(this, SkiTravel);

            var _this12 = _possibleConstructorReturn(this, (SkiTravel.__proto__ || Object.getPrototypeOf(SkiTravel)).call(this, initValue, minValue, maxValue));

            _this12.buildView("ski-travel");
            _this12.text.x = 120;
            return _this12;
        }

        return SkiTravel;
    }(NumericType);

    babyEye.SkiTravel = SkiTravel;

    var Page = function () {
        function Page(config) {
            _classCallCheck(this, Page);

            this.bg = config.bg;
            this.items = config.items;
            this.buildView();
        }

        _createClass(Page, [{
            key: "buildView",
            value: function buildView() {
                var _this13 = this;

                this.view = new createjs.Container();
                this.view.addChild(this.bg);
                this.items.forEach(function (item, index) {
                    _this13.view.addChild(item.content);
                    item.content.set({ x: item.x, y: item.y });
                });
            }
        }]);

        return Page;
    }();

    babyEye.Page = Page;

    var PopUp = function () {
        function PopUp(config) {
            _classCallCheck(this, PopUp);

            this.config = config;
            this.buildView();
        }

        _createClass(PopUp, [{
            key: "buildView",
            value: function buildView() {
                this.view = new createjs.Container();
                var img = babyEye.prepareTrainQueue.getResult("end-pop-up");
                var bg = new createjs.Bitmap(img);
                bg.set({ regX: img.width / 2, regY: img.height / 2 });
                this.text = new createjs.Text(this.config.text, "32px sans-serif", "rgb(50,50,50)");
                this.text.set({ x: -250, y: -100, lineHeight: 50 });

                this.view.addChild(bg, this.text);
                this.view.set({
                    x: 1280 / 2 + 50,
                    y: 720 / 2
                });
            }
        }]);

        return PopUp;
    }();

    babyEye.PopUp = PopUp;

    babyEye.setWrapText = function (textInstance, text) {
        var initWidth = textInstance.lineWidth;
        var textArray = text.split('');
        var i = -1;
        var prevText = '';
        var lines = [];

        textInstance.text = '';

        while (textArray[++i]) {
            textInstance.text += textArray[i];

            if (textInstance.getMeasuredWidth() > initWidth) {
                lines.push(prevText);
                textInstance.text = textArray[i];
            }
            prevText = textInstance.text;
        }
        lines.push(prevText);

        textInstance.text = lines.join('\n');
    };
    babyEye.rotateTrain = function (stage) {
        var width = document.documentElement.clientWidth,
            height = document.documentElement.clientHeight;
        if (width >= height) {
            // 横屏
            $('#loading').css({ 'transform': 'rotate(0deg)' });
            if (!stage) {
                return;
            }
            stage.rotation = 0;
            stage.x = 0;
            if (stage.canvas.width < stage.canvas.height) {
                var _ref = [stage.canvas.height, stage.canvas.width];
                stage.canvas.width = _ref[0];
                stage.canvas.height = _ref[1];
            }
        } else {
            // 竖屏
            $('#loading').css({ 'transform': 'rotate(90deg)' });
            $("canvas").css({
                'width': 'auto',
                'height': 'auto'
            });
            if (!stage) {
                return;
            }
            stage.x = 720; // 注意：x偏移相当于旋转中点处理，更简单
            stage.rotation = 90;
            if (stage.canvas.width > stage.canvas.height) {
                var _ref2 = [stage.canvas.height, stage.canvas.width];
                stage.canvas.width = _ref2[0];
                stage.canvas.height = _ref2[1];
            }
        }

        stage.update();
    };
    babyEye.prepareTrain = function (infor) {
        if (babyEye.isMobile()) babyEye.rotateTrain();
        $("#game-canvas").hide();
        if ($("#instruction-canvas").length == 0) {
            var canvas = document.createElement("canvas");
            canvas.id = "instruction-canvas";
            canvas.width = 1280;
            canvas.height = 720;
            $(canvas).addClass("scale");
            $("#game-canvas").before(canvas);
            window.handleResize();
        }
        $("#instruction-canvas").show();
        var stage = new createjs.Stage("instruction-canvas");
        stage.enableMouseOver();
        var result = {};
        var halfWidth = stage.canvas.width / 2,
            halfHeight = stage.canvas.height / 2;


        var options = ["selectGlasses", "selectLazyEye", "instruction", "selectDifficulty", "selectFuseType", "selectTwinkleType", "selectVergenceType", "testForFU", "callback"];
        var optionFuncs = [selectGlasses, selectLazyEye, buildInstruction, selectDifficulty, selectFuseType, selectTwinkleType, selectVergenceType, testForFU, finalCallback];
        var funcIndex = [];
        var currentIndex = 0;

        if (!babyEye.prepareTrainQueue) {
            loadResource(onComplete);
        } else {
            onComplete();
        }

        function onComplete() {
            beginSelect();
            if (!infor.calledByHelp) generateBitmaps();
            if (babyEye.isMobile()) babyEye.rotateTrain(stage);
        }

        function generateBitmaps() {
            babyEye.failBitmap = new Bitmap(babyEye.prepareTrainQueue.getResult("fail"));
            babyEye.successBitmap = new Bitmap(babyEye.prepareTrainQueue.getResult("success"));
            babyEye.failBitmap.set({ x: 1280 / 2, y: 720 / 2, scaleX: 0.65, scaleY: 0.65 });
            babyEye.successBitmap.set({ x: 1280 / 2, y: 720 / 2, scaleX: 0.65, scaleY: 0.65 });
        }

        function beginSelect() {
            options.forEach(function (option, index) {
                if (infor[option]) {
                    funcIndex.push(index);
                }
            });
            optionFuncs[funcIndex[currentIndex]]();
        }

        function nextFunc() {
            stage.removeAllChildren();
            currentIndex++;
            if (optionFuncs[funcIndex[currentIndex]]) optionFuncs[funcIndex[currentIndex]]();
        }

        function selectGlasses() {
            var img = babyEye.prepareTrainQueue.getResult("selectGlassesBG");
            var selectGlassesBG = new createjs.Bitmap(img);
            var redBlue = new babyEye.InteractiveButton(babyEye.prepareTrainQueue.getResult("redBlue"), babyEye.prepareTrainQueue.getResult("redBlue-hover"), function () {
                glassesSelected("rb");
            });

            var blueRed = new babyEye.InteractiveButton(babyEye.prepareTrainQueue.getResult("blueRed"), babyEye.prepareTrainQueue.getResult("blueRed-hover"), function () {
                glassesSelected("br");
            });

            redBlue.set({ x: halfWidth / 2 - 40, y: halfHeight - 120 });
            blueRed.set({ x: halfWidth * 1.5 - 245, y: halfHeight - 120 });

            stage.removeAllChildren();
            stage.addChild(selectGlassesBG, redBlue, blueRed);
            stage.update();

            if (infor.background) {
                var link = infor.staticPath + "img/version5/background/" + infor.background + ".png";
                $("body").css({
                    "background-image": "url" + "(" + link + ")",
                    "background-repeat": "repeat"
                });
            }
        }

        function selectLazyEye() {
            var lazyEye = localStorage.getItem("lazyeye");

            if (lazyEye !== "0" && lazyEye !== "1") {
                var selectEyeBG = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult("selectEyeBG"));
                stage.addChild(selectEyeBG);
                var leftEye = new babyEye.InteractiveButton(babyEye.prepareTrainQueue.getResult("left-eye"), babyEye.prepareTrainQueue.getResult("left-eye-hover"), function () {
                    lazyEyeSeleted(0);
                });

                var rightEye = new babyEye.InteractiveButton(babyEye.prepareTrainQueue.getResult("right-eye"), babyEye.prepareTrainQueue.getResult("right-eye-hover"), function () {
                    lazyEyeSeleted(1);
                });

                rightEye.set({ x: halfWidth * 1.5 - 245, y: halfHeight - 140 });
                leftEye.set({ x: halfWidth / 2 - 40, y: halfHeight - 140 });

                stage.addChild(leftEye, rightEye);
            } else {
                lazyEye = parseInt(lazyEye);
                lazyEyeSeleted(lazyEye);
            }
            stage.update();
        }

        function selectDifficulty() {
            var BG = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult("BG"));
            stage.addChild(BG);
            var difficultyTypes = ["easy", "medium", "hard"];
            var difficultyButtons = difficultyTypes.map(function (difficulty) {
                var button = new babyEye.InteractiveButton(babyEye.prepareTrainQueue.getResult(difficulty), babyEye.prepareTrainQueue.getResult(difficulty + "-hover"), function () {
                    difficultySelected(difficulty);
                });
                var img = babyEye.prepareTrainQueue.getResult(difficulty);
                button.set({ regX: img.width / 2 });
                button.set({ regY: img.height / 2 });
                stage.addChild(button);
                return button;
            });

            difficultyButtons[0].set({ x: halfWidth, y: 250 });
            difficultyButtons[1].set({ x: halfWidth, y: 400 });
            difficultyButtons[2].set({ x: halfWidth, y: 550 });
            stage.update();
        }

        function selectFuseType() {
            var BG = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult("selectMode"));
            stage.addChild(BG);
            var fuseTypes = ["fuse-center", "fuse-round", "fuse-entire"];
            var fuseButtons = fuseTypes.map(function (id) {
                var button = new babyEye.InteractiveButton(babyEye.prepareTrainQueue.getResult(id), babyEye.prepareTrainQueue.getResult(id + "-hover"), function () {
                    fuseTypeSelected(id.split("-")[1]);
                });
                var img = babyEye.prepareTrainQueue.getResult(id);
                button.set({ regX: img.width / 2 });
                button.set({ regY: img.height / 2 });
                stage.addChild(button);
                return button;
            });

            fuseButtons[0].set({ x: halfWidth, y: 250 });
            fuseButtons[1].set({ x: halfWidth, y: 400 });
            fuseButtons[2].set({ x: halfWidth, y: 550 });
            stage.update();
        }

        function selectTwinkleType() {
            var BG = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult("selectMode"));
            stage.addChild(BG);
            var twinkleTypes = ["twinkle-altermate", "twinkle-lazy", "twinkle-same-time"];
            var twinkleButtons = twinkleTypes.map(function (id) {
                var button = new babyEye.InteractiveButton(babyEye.prepareTrainQueue.getResult(id), babyEye.prepareTrainQueue.getResult(id + "-hover"), function () {
                    twinkleTypeSelected(id.split("-")[1]);
                });
                var img = babyEye.prepareTrainQueue.getResult(id);
                button.set({ regX: img.width / 2 });
                button.set({ regY: img.height / 2 });
                stage.addChild(button);
                return button;
            });

            twinkleButtons[0].set({ x: halfWidth, y: 250 });
            twinkleButtons[1].set({ x: halfWidth, y: 400 });
            twinkleButtons[2].set({ x: halfWidth, y: 550 });
            stage.update();
        }

        function selectVergenceType() {
            var BG = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult("selectMode"));
            stage.addChild(BG);
            var vergenceTypes = ["convergence", "divergence"];
            var fuseButtons = vergenceTypes.map(function (id) {
                var button = new babyEye.InteractiveButton(babyEye.prepareTrainQueue.getResult(id), babyEye.prepareTrainQueue.getResult(id + "-hover"), function () {
                    vergenceTypeSelected(id);
                });
                var img = babyEye.prepareTrainQueue.getResult(id);
                button.set({ regX: img.width / 2 });
                button.set({ regY: img.height / 2 });
                stage.addChild(button);
                return button;
            });

            fuseButtons[0].set({ x: halfWidth, y: 300 });
            fuseButtons[1].set({ x: halfWidth, y: 500 });
            stage.update();
        }

        function testForFU() {
            var leftColor = result.glasses == "rb" ? "red" : "blue";
            var rightColor = result.glasses == "rb" ? "blue" : "red";
            var minFU = 30,
                maxFU = 300;
            var squint = babyEye.getParam(window.location.href, "squint");
            var bgIDs = null;
            if (squint == "exotropia") {
                bgIDs = ["testForConvergence"];
            } else if (squint == "esotropia") {
                bgIDs = ["testForDivergence"];
            } else {
                bgIDs = ["testForConvergence", "testForDivergence"];
            }
            var currentBGIndex = 0;
            var currentBG = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult(bgIDs[currentBGIndex]));
            stage.addChild(currentBG);

            var TargetFU = function () {
                function TargetFU() {
                    _classCallCheck(this, TargetFU);

                    this.vx = 0.01;
                    this.lastFrame = 0;
                    this.setView();
                    this.buildButtons();
                    this.render();
                }

                _createClass(TargetFU, [{
                    key: "setView",
                    value: function setView() {
                        this.view = new createjs.Container();
                        this.view.compositeOperation = "darken";
                        this.targetLeft = new createjs.Shape();
                        this.targetLeftCommand = this.targetLeft.graphics.f(leftColor).command;
                        this.targetLeft.graphics.dc(0, 0, 50);
                        this.targetRight = new createjs.Shape();
                        this.targetRightCommand = this.targetRight.graphics.f(rightColor).command;
                        this.targetRight.graphics.dc(0, 0, 50);
                        if (squint == "esotropia") {
                            ;
                            var _ref3 = [this.targetRight, this.targetLeft];
                            this.targetLeft = _ref3[0];
                            this.targetRight = _ref3[1];
                        }this.view.addChild(this.targetLeft, this.targetRight);
                        stage.addChild(this.view);
                        this.view.set({
                            x: stage.canvas.width / 2,
                            y: stage.canvas.height / 2
                        });
                    }
                }, {
                    key: "buildButtons",
                    value: function buildButtons() {
                        var _this14 = this;

                        this.statusButton = new StatusButton();
                        this.confirmButton = new ConfirmButton(function () {
                            _this14.handleConfirm();
                        });
                        this.skipButton = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult("skip"));
                        this.skipButton.set({ x: stage.canvas.width / 2 - 180, y: stage.canvas.height * 3 / 4, cursor: "pointer" });
                        this.skipButton.addEventListener("mousedown", function () {
                            if (babyEye.lastTrainInfor) {
                                result.convergenceDelta = babyEye.lastTrainInfor.convergenceDelta;
                                result.divergenceDelta = babyEye.lastTrainInfor.divergenceDelta;
                            } else {
                                result.convergenceDelta = minFU;
                                result.divergenceDelta = minFU;
                            }
                            _this14.complete = true;
                            nextFunc();
                        });

                        stage.addChild(this.statusButton.view, this.confirmButton.view, this.skipButton);
                    }
                }, {
                    key: "handleConfirm",
                    value: function handleConfirm() {
                        this.statusButton.changeStatus("stop");
                        var deltaX = this.targetRight.x - this.targetLeft.x;
                        deltaX = babyEye.constrain(deltaX, minFU, maxFU);
                        this.targetLeft.x = this.targetRight.x = 0;

                        if (bgIDs[currentBGIndex] == "testForConvergence") {
                            result.convergenceDelta = deltaX;
                        } else {
                            result.divergenceDelta = deltaX;
                        }
                        currentBGIndex++;
                        if (bgIDs[currentBGIndex]) {
                            stage.removeChild(currentBG);
                            currentBG = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult(bgIDs[currentBGIndex]));
                            stage.addChildAt(currentBG, 0);
                            var _ref4 = [this.targetLeftCommand.style, this.targetRightCommand.style];
                            this.targetRightCommand.style = _ref4[0];
                            this.targetLeftCommand.style = _ref4[1];
                        } else {
                            this.complete = true;
                            if (!result.divergenceDelta) result.divergenceDelta = 0;
                            if (!result.convergenceDelta) result.convergenceDelta = 0;
                            stage.removeAllChildren();
                            nextFunc();
                        }
                    }
                }, {
                    key: "update",
                    value: function update(dt) {
                        if (this.statusButton.status == "stop") return;
                        if (this.targetRight.x < 150) {
                            this.targetLeft.x -= this.vx * dt;
                            this.targetRight.x += this.vx * dt;
                        } else {
                            this.handleConfirm();
                        }
                    }
                }, {
                    key: "render",
                    value: function render() {
                        var _this15 = this;

                        var timestamp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

                        if (this.complete) return;
                        var dt = timestamp - this.lastFrame;
                        this.lastFrame = timestamp;
                        if (dt < 0 || dt > 150) dt = 0;
                        this.update(dt);
                        stage.update();
                        window.requestAnimationFrame(function (timestamp) {
                            _this15.render(timestamp);
                        });
                    }
                }]);

                return TargetFU;
            }();

            var StatusButton = function () {
                function StatusButton(callback) {
                    _classCallCheck(this, StatusButton);

                    this.callback = callback;
                    this.status = "stop";
                    this.setView();
                    this.events();
                }

                _createClass(StatusButton, [{
                    key: "setView",
                    value: function setView() {
                        if (!this.view) this.view = new createjs.Container();
                        this.view.removeAllChildren();
                        var img = this.status == "move" ? babyEye.prepareTrainQueue.getResult("pause") : babyEye.prepareTrainQueue.getResult("move-right");
                        var bitmap = new createjs.Bitmap(img);
                        bitmap.set({
                            cursor: "pointer"
                        });
                        this.view.x = stage.canvas.width / 2 + 100;
                        this.view.y = stage.canvas.height * 3 / 4;
                        this.view.addChild(bitmap);
                        window.stage = stage;
                    }
                }, {
                    key: "events",
                    value: function events() {
                        var _this16 = this;

                        this.view.addEventListener("mousedown", function () {
                            _this16.changeStatus();
                            _this16.setView();
                        });
                    }
                }, {
                    key: "changeStatus",
                    value: function changeStatus(status) {
                        if (status) {
                            this.status = status;
                        } else {
                            this.status = this.status == "move" ? "stop" : "move";
                        }
                        this.setView();
                    }
                }]);

                return StatusButton;
            }();

            var ConfirmButton = function () {
                function ConfirmButton(callback) {
                    _classCallCheck(this, ConfirmButton);

                    this.callback = callback;
                    this.confirmTimes = 0;
                    this.setView();
                    this.events();
                }

                _createClass(ConfirmButton, [{
                    key: "setView",
                    value: function setView() {
                        this.view = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult("confirm-text"));
                        this.view.set({
                            x: stage.canvas.width / 2 - 40,
                            y: stage.canvas.height * 3 / 4,
                            cursor: "pointer"
                        });
                    }
                }, {
                    key: "events",
                    value: function events() {
                        var _this17 = this;

                        this.view.addEventListener("mousedown", function () {
                            _this17.confirmTimes++;
                            _this17.callback();
                        });
                    }
                }]);

                return ConfirmButton;
            }();

            new TargetFU();
        }

        //选择完毕
        function glassesSelected(glasses) {
            result.glasses = glasses;
            nextFunc();
        }

        function lazyEyeSeleted(lazyEye) {

            result.targetInfor = {};
            result.lazyEye = lazyEye;
            if (!result.glasses) {
                throw new Error("glasses not defined");return;
            };
            var glassesNumber = result.glasses == "rb" ? 0 : 1;

            if (anTarget(1, lazyEye, glassesNumber) == 0) {
                result.targetInfor.filter = new createjs.ColorFilter(1, 0, 0, 1, 255, 0, 0, 0);
                result.targetInfor.color = "red";
            } else {
                result.targetInfor.filter = new createjs.ColorFilter(0, 0, 1, 1, 0, 0, 255, 0);
                result.targetInfor.color = "blue";
            }

            nextFunc();
        }

        function difficultySelected(difficulty) {
            result.difficulty = difficulty;
            nextFunc();
        }

        function fuseTypeSelected(type) {
            result.fuseType = type;
            nextFunc();
        }

        function twinkleTypeSelected(type) {
            result.twinkleType = type;
            nextFunc();
        }

        function vergenceTypeSelected(type) {
            result.vergenceType = type;
            nextFunc();
        }

        function buildInstruction() {
            stage.removeAllChildren();
            if (typeof infor.instruction == "string") {
                var instructionBG = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult("instructionBG"));
                stage.addChild(instructionBG);

                var fontSizeDelta = infor.fontSizeDelta ? infor.fontSizeDelta : 0;
                var instructionText = new createjs.Text("", "normal " + (30 + fontSizeDelta) + "px sans-serif", "rgb(50,50,50)");
                instructionText.set({
                    lineWidth: 700,
                    x: 300,
                    y: 200,
                    lineHeight: 38 + (infor.lineHeightDelta ? infor.lineHeightDelta : 0)
                });

                if (is360()) {
                    instructionText.font = "bold " + (28 + fontSizeDelta) + "px sans-serif";
                    var space = "    ";
                    babyEye.setWrapText(instructionText, infor.instruction);
                } else {
                    var _space = "      ";
                    babyEye.setWrapText(instructionText, infor.instruction);
                }

                stage.addChild(instructionText);
            } else {
                var bg = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult(infor.instruction.id));
                stage.addChild(bg);
            }

            var imgID = infor.calledByHelp ? "confirm" : "start";
            var start = new babyEye.InteractiveButton(babyEye.prepareTrainQueue.getResult(imgID + "-text"), babyEye.prepareTrainQueue.getResult(imgID), nextFunc);

            start.set({ x: 1280 - 100, y: 720 - 100 });

            stage.addChild(start);
            if (infor.instructionItems) {
                infor.instructionItems.forEach(function (item) {
                    var bitmap = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult(item.id));
                    bitmap.set({ x: item.x, y: item.y });
                    stage.addChild(bitmap);
                });
            }
            stage.update();
        }

        function finalCallback() {
            babyEye.lastTrainInfor = {};
            Object.assign(babyEye.lastTrainInfor, result);
            if (infor.callback) infor.callback(result);
            stage.removeAllChildren();
            stage.update();
            stage.enableMouseOver(0);

            $("#instruction-canvas").hide();
            $("#game-canvas").show();
        }

        function loadResource(onComplete) {
            babyEye.prepareTrainQueue = new createjs.LoadQueue();

            babyEye.prepareTrainQueue.setMaxConnections(100);
            // 关键！---一定要将其设置为 true, 否则不起作用。  
            babyEye.prepareTrainQueue.maintainScriptOrder = true;

            var path = infor.staticPath + "img/version5";
            // infor.templateType = "space";
            if (infor.templateType && infor.templateType != "country") {
                path = path + "-" + infor.templateType;
            }

            if (!infor.language || infor.language && infor.language == "zh") {
                path += "/";
            } else if (infor.language) {
                path = path + "-" + infor.language + "/";
            }
            var loadArr = [];
            var loadingText = new createjs.Text("", "30px fantasy", "rgb(50,50,50)");
            loadingText.set({ x: halfWidth, y: halfHeight, textAlign: "center", textBaseline: "middle" });
            stage.addChild(loadingText);

            var buttons = ["redBlue.png", "redBlue-hover.png", "blueRed.png", "blueRed-hover.png", "left-eye.png", "left-eye-hover.png", "right-eye.png", "right-eye-hover.png", "start.png", "start-text.png", "confirm.png", "confirm-text.png", "replay.png", "help.png", "replay-text.png", "help-text.png", "move-right.png", "pause.png", "skip.png"].map(function (name) {
                return toLoadObj(name, path + "buttons/" + name);
            });

            var background = ["selectGlassesBG.png", "instructionBG.png", "selectEyeBG.png", "BG.png", "selectMode.png"].map(function (name) {
                return toLoadObj(name, path + "background/" + name);
            });

            var testForFUBG = ["testForConvergence.png", "testForDivergence.png"].map(function (name) {
                return toLoadObj(name, path + "background/" + name);
            });

            var other = ["fail.png", "success.png", "count-down.png", "end-pop-up.png", "level.png", "score.png", "remain.png", "travel.png", "ski-travel.png"].map(function (name) {
                return toLoadObj(name, path + "other/" + name);
            });

            var difficultyRelated = ["easy.png", "easy-hover.png", "medium.png", "medium-hover.png", "hard.png", "hard-hover.png"].map(function (name) {
                return toLoadObj(name, path + "buttons/" + name);
            });

            var fuseButtons = ["fuse-center.png", "fuse-center-hover.png", "fuse-entire.png", "fuse-entire-hover.png", "fuse-round.png", "fuse-round-hover.png"].map(function (name) {
                return toLoadObj(name, path + "buttons/" + name);
            });

            var twinkleButtons = ["twinkle-altermate.png", "twinkle-altermate-hover.png", "twinkle-lazy.png", "twinkle-lazy-hover.png", "twinkle-same-time.png", "twinkle-same-time-hover.png"].map(function (name) {
                return toLoadObj(name, path + "buttons/" + name);
            });

            var vergenceButtons = ["convergence.png", "convergence-hover.png", "divergence.png", "divergence-hover.png"].map(function (name) {
                return toLoadObj(name, path + "buttons/" + name);
            });

            loadArr = loadArr.concat(buttons).concat(background).concat(other);
            if (infor.testForFU) loadArr = loadArr.concat(testForFUBG);
            if (infor.selectDifficulty) loadArr = loadArr.concat(difficultyRelated);
            if (infor.selectFuseType) loadArr = loadArr.concat(fuseButtons);
            if (infor.selectTwinkleType) loadArr = loadArr.concat(twinkleButtons);
            if (infor.selectVergenceType) loadArr = loadArr.concat(vergenceButtons);
            if (infor.instructionItems) loadArr = loadArr.concat(infor.instructionItems);
            if (infor.instruction && typeof infor.instruction != "string") loadArr.push(infor.instruction);

            if (infor.language != "en") {
                babyEye.prepareTrainQueue.addEventListener("progress", function (ev) {
                    loadingText.text = "资源加载中...";
                    stage.update();
                });
            }
            babyEye.prepareTrainQueue.addEventListener("complete", function (ev) {
                $("#loading").hide();
                stage.removeAllChildren();
                onComplete();
            });
            babyEye.prepareTrainQueue.loadManifest(loadArr);
        }

        function toLoadObj(name, path) {
            var id = name.slice(0, name.indexOf("."));
            return { id: id, src: path };
        }
    };

    window.handleResize = function () {
        if (window.innerWidth < window.innerHeight * 1280 / 720) {
            $("#game-canvas").css({
                "height": "auto",
                "width": "100vw"
            });
            $(".scale").css({
                "height": "auto",
                "width": "100vw"
            });
        } else {
            $("#game-canvas").css({
                "height": "100vh",
                "width": "auto"
            });
            $(".scale").css({
                "height": "100vh",
                "width": "auto"
            });
        };
    };

    window.addEventListener('resize', handleResize, false);
    window.handleResize();

    function is360() {
        //检测是否是谷歌内核(可排除360及谷歌以外的浏览器)
        function isChrome() {
            var ua = navigator.userAgent.toLowerCase();

            return ua.indexOf("chrome") > 1;
        }
        //测试mime
        function _mime(option, value) {
            var mimeTypes = navigator.mimeTypes;
            for (var mt in mimeTypes) {
                if (mimeTypes[mt][option] == value) {
                    return true;
                }
            }
            return false;
        }

        //application/vnd.chromium.remoting-viewer 可能为360特有
        var is360Value = _mime("type", "application/vnd.chromium.remoting-viewer");

        return isChrome() && is360Value;
    }

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    babyEye.getCookie = getCookie;

    function isMobile() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return true;
        } else {
            return false;
        }
    }

    babyEye.isMobile = isMobile;

    window.babyEye = babyEye;
});