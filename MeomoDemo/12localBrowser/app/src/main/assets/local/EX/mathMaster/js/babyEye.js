"use strict";

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

$(window).ready(function () {
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

    //new ImageSTE({image:xxx, colors:["red","blue"], delta:10}) -> image;

    var ImageSTE = function ImageSTE(config) {
        _classCallCheck(this, ImageSTE);

        if (config.colors.indexOf("r") == -1 || config.colors.indexOf("gb") == -1) {
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

        for (var _i = 0; _i < dataLength; _i += 4) {
            imageDataLeft.data[_i + 1] = 0;
            imageDataLeft.data[_i + 2] = 0;
        }

        for (var _i2 = 0; _i2 < dataLength; _i2 += 4) {
            result.data[_i2] = imageDataLeft.data[_i2];
            result.data[_i2 + 1] = imageDataRight.data[_i2 + 1];
            result.data[_i2 + 2] = imageDataRight.data[_i2 + 2];
            result.data[_i2 + 3] = imageDataRight.data[_i2 + 3] + imageDataLeft.data[_i2 + 3];
        }
        ctx.putImageData(result, 0, 0);

        var imgDom = document.createElement("img");
        imgDom.src = canvas.toDataURL("image/png");
        imgDom.width = img.width + delta;
        imgDom.height = img.height;
        return imgDom;
    };

    babyEye.ImageSTE = ImageSTE;

    //只取中间像素

    var ImageMidSTE = function ImageMidSTE(config) {
        _classCallCheck(this, ImageMidSTE);

        if (config.colors.indexOf("r") == -1 || config.colors.indexOf("gb") == -1) {
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

        for (var _i3 = 0; _i3 < dataLength; _i3 += 4) {
            imageDataLeft.data[_i3 + 1] = 0;
            imageDataLeft.data[_i3 + 2] = 0;
        }

        for (var _i4 = 0; _i4 < dataLength; _i4 += 4) {
            result.data[_i4] = imageDataLeft.data[_i4];
            result.data[_i4 + 1] = imageDataRight.data[_i4 + 1];
            result.data[_i4 + 2] = imageDataRight.data[_i4 + 2];
            result.data[_i4 + 3] = imageDataRight.data[_i4 + 3] && imageDataLeft.data[_i4 + 3];
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

    var Button = function (_c$Bitmap) {
        _inherits(Button, _c$Bitmap);

        function Button(id, callback) {
            _classCallCheck(this, Button);

            var img = window.queue.getResult(id);

            var _this = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this, img));

            _this.addEventListener("click", function (ev) {
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

            _this2.addEventListener("mousedown", function (ev) {
                ev.stopPropagation();
                callback();
            });

            _this2.regX = img.width / 2;
            _this2.regY = img.height / 2;
            return _this2;
        }

        return ImageButton;
    }(createjs.Bitmap);

    babyEye.ImageButton = ImageButton;

    babyEye.prepareTrain = function (infor) {
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
        var queue = new createjs.LoadQueue();
        var stage = new createjs.Stage("instruction-canvas");
        stage.enableMouseOver();
        var result = {};
        var halfWidth = stage.canvas.width / 2,
            halfHeight = stage.canvas.height / 2;

        loadResource(onComplete);

        function onComplete() {
            if (infor.selectGlasses) {
                var img = queue.getResult("selectGlassesBG");
                var selectGlassesBG = new createjs.Bitmap(img);
                var redBlue = new babyEye.ImageButton(queue.getResult("redBlue"), function () {
                    result.glasses = "rb";
                    glassesSelected();
                });

                var blueRed = new babyEye.ImageButton(queue.getResult("blueRed"), function () {
                    result.glasses = "br";
                    glassesSelected();
                });

                redBlue.set({ x: halfWidth / 2 + 100, y: halfHeight - 100, cursor: "pointer" });
                blueRed.set({ x: halfWidth * 1.5 - 120, y: halfHeight - 100, cursor: "pointer" });

                stage.addChild(selectGlassesBG, redBlue, blueRed);
            } else if (infor.selectDifficulty) {
                selectDifficulty();
            }

            stage.update();
        }

        function selectDifficulty() {
            var hard = new babyEye.ImageButton(queue.getResult("hard"), function () {
                result.difficulty = "hard";
                finalCallback();
            });
            var medium = new babyEye.ImageButton(queue.getResult("medium"), function () {
                result.difficulty = "medium";
                finalCallback();
            });
            var easy = new babyEye.ImageButton(queue.getResult("easy"), function () {
                result.difficulty = "easy";
                finalCallback();
            });

            easy.set({
                x: halfWidth,
                y: 300,
                cursor: "pointer"
            });

            medium.set({
                x: halfWidth,
                y: 400,
                cursor: "pointer"
            });

            hard.set({
                x: halfWidth,
                y: 500,
                cursor: "pointer"
            });

            stage.removeAllChildren();
            stage.addChild(easy, medium, hard);
            stage.update();
        }

        //眼镜选择完毕
        function glassesSelected() {
            if (infor.selectDifficulty) {
                selectDifficulty();
            } else {
                finalCallback();
            };
        }

        function finalCallback() {
            infor.callback(result);
            stage.removeAllChildren();
            stage.update();
            $("#instruction-canvas").hide();
        }

        function loadResource(onComplete) {
            var path = infor.staticPath + "img/version5/";
            var loadArr = [];
            var loadingText = new createjs.Text("", "20px Arial", "black");
            loadingText.set({ x: halfWidth, y: halfHeight });
            stage.addChild(loadingText);

            var buttons = ["easy.png", "medium.png", "hard.png", "redBlue.png", "blueRed.png"].map(function (name) {
                return toLoadObj(name, path + "buttons/" + name);
            });

            var background = ["selectGlassesBG.png"].map(function (name) {
                return toLoadObj(name, path + "background/" + name);
            });

            loadArr = loadArr.concat(buttons).concat(background);

            queue.addEventListener("complete", function (ev) {
                stage.removeAllChildren();
                onComplete();
            });
            queue.addEventListener("progress", function (ev) {
                loadingText.text = (ev.progress * 100).toFixed() + "%";
                stage.update();
                // console.log((ev.progress * 100).toFixed() + "%");
            });
            queue.loadManifest(loadArr);
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

    window.babyEye = babyEye;
});