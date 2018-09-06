var ls;
(function (ls) {
    var AIBrowser = (function (_super) {
        __extends(AIBrowser, _super);
        function AIBrowser() {
            _super.call(this);
            this.firstRequestFullscreen = true;
            this._isSupportVibrate = false;
            this.orientations = [
                "portrait",
                "landscape",
                "portrait-primary",
                "portrait-secondary",
                "landscape-primary",
                "landscape-secondary"
            ];
            if (AIBrowser._instance != null)
                throw new Error("AITouch为单例！！！");
            this.name = "Browser";
            AIBrowser._instance = this;
        }
        var d = __define,c=AIBrowser,p=c.prototype;
        d(AIBrowser, "instance"
            ,function () {
                if (this._instance == null)
                    this._instance = new AIBrowser();
                return this._instance;
            }
        );
        p.initialize = function () {
            var self = this;
            if (window.addEventListener) {
                window.addEventListener("resize", function () {
                    self.dispatchEvent(new ls.TriggerEvent(ls.TriggerEvent.TRIGGER, self.onResize));
                });
                if (typeof navigator.onLine !== "undefined") {
                    window.addEventListener("online", function () {
                        self.dispatchEvent(new ls.TriggerEvent(ls.TriggerEvent.TRIGGER, self.onOnline));
                    });
                    window.addEventListener("offline", function () {
                        self.dispatchEvent(new ls.TriggerEvent(ls.TriggerEvent.TRIGGER, self.onOffline));
                    });
                }
                if (typeof window.applicationCache !== "undefined") {
                    window.applicationCache.addEventListener("updateready", function () {
                    });
                    window.applicationCache.addEventListener("progress", function () {
                    });
                }
            }
        };
        p.saveToJSON = function () {
            return _super.prototype.saveToJSON.call(this);
        };
        p.loadFromJSON = function (o) {
            if (o) {
                _super.prototype.loadFromJSON.call(this, o);
            }
        };
        d(p, "URL"
            ,function () {
                if (window.location)
                    return window.location.toString();
                return "";
            }
        );
        d(p, "protocol"
            ,function () {
                if (window.location)
                    return window.location.protocol;
                return "";
            }
        );
        d(p, "host"
            ,function () {
                if (window.location)
                    return window.location.host;
                return "";
            }
        );
        d(p, "hostname"
            ,function () {
                if (window.location)
                    return window.location.hostname;
                return "";
            }
        );
        d(p, "port"
            ,function () {
                if (window.location)
                    return window.location.port;
                return "";
            }
        );
        d(p, "pathname"
            ,function () {
                if (window.location)
                    return window.location.pathname;
                return "";
            }
        );
        d(p, "hash"
            ,function () {
                if (window.location)
                    return window.location.hash;
                return "";
            }
        );
        d(p, "Referer"
            ,function () {
                if (window.document)
                    return window.document.referrer;
                return "";
            }
        );
        d(p, "Title"
            ,function () {
                if (window.document)
                    return document.title;
                return "";
            }
        );
        d(p, "appName"
            ,function () {
                if (window.navigator)
                    return navigator.appName;
                return "";
            }
        );
        d(p, "appVersion"
            ,function () {
                if (window.navigator)
                    return window.navigator.appVersion;
                return "";
            }
        );
        d(p, "language"
            ,function () {
                if (navigator && navigator.language)
                    return navigator.language;
                else
                    return "";
            }
        );
        d(p, "queryString"
            ,function () {
                if (window.location && window.location.search)
                    return window.location.search;
                return "";
            }
        );
        d(p, "screenWidth"
            ,function () {
                if (window.screen)
                    return screen.width;
                return ls.GameUILayer.stage.stageWidth;
            }
        );
        d(p, "screenHeight"
            ,function () {
                if (window.screen)
                    return screen.height;
                return ls.GameUILayer.stage.stageHeight;
            }
        );
        d(p, "platform"
            ,function () {
                if (window.navigator && window.navigator && window.navigator.platform)
                    return navigator.platform;
                return "";
            }
        );
        d(p, "isSupportVibrate"
            ,function () {
                if (window.navigator) {
                    this._isSupportVibrate = window.navigator["vibrate"] || window.navigator["webkitVibrate"] || window.navigator["mozVibrate"] || window.navigator["msVibrate"];
                    return this._isSupportVibrate;
                }
                return false;
            }
        );
        p.isCanSupportVibrated = function ($event) {
            return { instances: [this], status: this.isSupportVibrate };
        };
        p.cookiesEnabled = function ($event) {
            if (window.navigator)
                return window.navigator ? { instances: [this], status: window.navigator.cookieEnabled } : { instances: [this], status: false };
            return { instances: [this], status: false };
        };
        p.isOnline = function ($event) {
            if (window.navigator)
                return window.navigator ? { instances: [this], status: window.navigator.onLine } : { instances: [this], status: false };
            return { instances: [this], status: false };
        };
        p.hasJava = function ($event) {
            if (window.navigator)
                return window.navigator ? { instances: [this], status: window.navigator.javaEnabled() } : { instances: [this], status: false };
            return { instances: [this], status: false };
        };
        p.onOnline = function ($event) {
            return { instances: [this], status: true };
        };
        p.onOffline = function ($event) {
            return { instances: [this], status: true };
        };
        p.onResize = function ($event) {
            return { instances: [this], status: true };
        };
        p.isFullscreen = function ($event) {
            return { instances: [this], status: !!(window.document && window.document["mozFullScreen"] || window.document && window.document["webkitIsFullScreen"] || window.document && window.document["fullScreen"]) };
        };
        p.isPortraitLandscape = function (event) {
            return { instances: [this], status: ls.GameUILayer.orientation === ls.eval_e(event.orientaion) };
        };
        p.supportsFullscreen = function (event) {
            if (document.getElementById) {
                var canvas = document.getElementById("gameDiv");
                if (canvas)
                    return { instances: [this], status: !!(canvas["requestFullscreen"] || canvas["mozRequestFullScreen"] || canvas["msRequestFullscreen"] || canvas["webkitRequestFullScreen"]) };
            }
            return { instances: [this], status: false };
        };
        p.showAlert = function (message) {
            alert(message);
        };
        p.closeWindow = function () {
            if (window.close)
                window.close();
        };
        p.focus = function () {
            if (window.focus)
                window.focus();
        };
        p.blur = function () {
            if (window.blur)
                window.blur();
        };
        p.gotoURL = function (url, target) {
            var _target = parseInt(target);
            if (_target == 0) {
                if (window.location)
                    window.location.href = url;
            }
            else if (_target == 1) {
                if (window.parent && window.parent.location)
                    window.parent.location.href = url;
            }
            else {
                if (window.top && window.top.location)
                    window.top.location.href = url;
            }
        };
        p.gotoURLWindow = function (url, tag) {
            setTimeout(function (url, tag) {
                if (window.open)
                    window.open(url, tag);
            }, 100, url, tag);
        };
        p.reload = function () {
            if (window.location)
                window.location.reload();
        };
        p.requestFullScreen = function () {
            if (window.document && window.document.getElementById) {
                var canvas = document.getElementById("gameDiv");
                if (canvas) {
                    if (this.firstRequestFullscreen) {
                        this.firstRequestFullscreen = false;
                        canvas.addEventListener("mozfullscreenerror", this.onFullscreenError);
                        canvas.addEventListener("webkitfullscreenerror", this.onFullscreenError);
                        canvas.addEventListener("MSFullscreenError", this.onFullscreenError);
                        canvas.addEventListener("fullscreenerror", this.onFullscreenError);
                    }
                    if (canvas["requestFullscreen"])
                        canvas["requestFullscreen"]();
                    else if (canvas["mozRequestFullScreen"])
                        canvas["mozRequestFullScreen"]();
                    else if (canvas["msRequestFullScreen"])
                        canvas["msRequestFullScreen"]();
                    else if (canvas["webkitRequestFullScreen"]) {
                    }
                }
            }
        };
        p.cancelFullScreen = function () {
            if (window.document) {
                if (window.document["exitFullscreen"])
                    window.document["exitFullscreen"]();
                else if (window.document["mozCancelFullScreen"])
                    window.document["mozCancelFullScreen"]();
                else if (window.document["msExitFullscreen"])
                    window.document["msExitFullscreen"]();
                else if (window.document["webkitCancelFullScreen"])
                    window.document["webkitCancelFullScreen"]();
            }
        };
        p.vibrate = function (pattern_) {
            try {
                pattern_ = "200,100,200";
                var arr = pattern_.split(",");
                for (var i = 0; i < arr.length; i++) {
                    arr[i] = parseInt(arr[i], 10);
                }
                if (window.navigator) {
                    if (window.navigator["vibrate"])
                        window.navigator["vibrate"](arr);
                    else if (window.navigator["mozVibrate"])
                        window.navigator["mozVibrate"](arr);
                    else if (window.navigator["webkitVibrate"])
                        window.navigator["webkitVibrate"](arr);
                    else if (window.navigator["msVibrate"])
                        window.navigator["msVibrate"](arr);
                }
            }
            catch (e) { }
        };
        p.execJs = function (js_) {
            try {
                if (eval)
                    eval(js_);
            }
            catch (e) {
                if (console && console.error)
                    console.error("执行JS语句发生错误！！", e);
            }
        };
        p.lockOrientation = function (o) {
            var o = ls.eval_e(o);
            o = Math.floor(o);
            if (o < 0 || o >= this.orientations.length)
                return;
            var orientation = this.orientations[o];
            if (screen["orientation"] && screen["orientation"]["lock"])
                screen["orientation"]["lock"](orientation);
            else if (screen["lockOrientation"])
                screen["lockOrientation"](orientation);
            else if (screen["webkitLockOrientation"])
                screen["webkitLockOrientation"](orientation);
            else if (screen["mozLockOrientation"])
                screen["mozLockOrientation"](orientation);
            else if (screen["msLockOrientation"])
                screen["msLockOrientation"](orientation);
        };
        p.unLockOrientation = function () {
            if (screen["orientation"] && screen["orientation"]["unlock"])
                screen["orientation"]["unlock"]();
            else if (screen["unlockOrientation"])
                screen["unlockOrientation"]();
            else if (screen["webkitUnlockOrientation"])
                screen["webkitUnlockOrientation"]();
            else if (screen["mozUnlockOrientation"])
                screen["mozUnlockOrientation"]();
            else if (screen["msUnlockOrientation"])
                screen["msUnlockOrientation"]();
        };
        p.onFullscreenError = function (error) {
        };
        return AIBrowser;
    }(ls.AIObject));
    ls.AIBrowser = AIBrowser;
    egret.registerClass(AIBrowser,'ls.AIBrowser');
    var IsSupportVibrateEvent = (function (_super) {
        __extends(IsSupportVibrateEvent, _super);
        function IsSupportVibrateEvent() {
            _super.call(this);
        }
        var d = __define,c=IsSupportVibrateEvent,p=c.prototype;
        return IsSupportVibrateEvent;
    }(ls.BaseEvent));
    ls.IsSupportVibrateEvent = IsSupportVibrateEvent;
    egret.registerClass(IsSupportVibrateEvent,'ls.IsSupportVibrateEvent');
    var IsCookiesEnabledEvent = (function (_super) {
        __extends(IsCookiesEnabledEvent, _super);
        function IsCookiesEnabledEvent() {
            _super.call(this);
        }
        var d = __define,c=IsCookiesEnabledEvent,p=c.prototype;
        return IsCookiesEnabledEvent;
    }(ls.BaseEvent));
    ls.IsCookiesEnabledEvent = IsCookiesEnabledEvent;
    egret.registerClass(IsCookiesEnabledEvent,'ls.IsCookiesEnabledEvent');
    var IsOnlineEvent = (function (_super) {
        __extends(IsOnlineEvent, _super);
        function IsOnlineEvent() {
            _super.call(this);
        }
        var d = __define,c=IsOnlineEvent,p=c.prototype;
        return IsOnlineEvent;
    }(ls.BaseEvent));
    ls.IsOnlineEvent = IsOnlineEvent;
    egret.registerClass(IsOnlineEvent,'ls.IsOnlineEvent');
    var IsHasJavaEvent = (function (_super) {
        __extends(IsHasJavaEvent, _super);
        function IsHasJavaEvent() {
            _super.call(this);
        }
        var d = __define,c=IsHasJavaEvent,p=c.prototype;
        return IsHasJavaEvent;
    }(ls.BaseEvent));
    ls.IsHasJavaEvent = IsHasJavaEvent;
    egret.registerClass(IsHasJavaEvent,'ls.IsHasJavaEvent');
    var OnOnlineEvent = (function (_super) {
        __extends(OnOnlineEvent, _super);
        function OnOnlineEvent() {
            _super.call(this);
        }
        var d = __define,c=OnOnlineEvent,p=c.prototype;
        return OnOnlineEvent;
    }(ls.BaseEvent));
    ls.OnOnlineEvent = OnOnlineEvent;
    egret.registerClass(OnOnlineEvent,'ls.OnOnlineEvent');
    var OnOfflineEvent = (function (_super) {
        __extends(OnOfflineEvent, _super);
        function OnOfflineEvent() {
            _super.call(this);
        }
        var d = __define,c=OnOfflineEvent,p=c.prototype;
        return OnOfflineEvent;
    }(ls.BaseEvent));
    ls.OnOfflineEvent = OnOfflineEvent;
    egret.registerClass(OnOfflineEvent,'ls.OnOfflineEvent');
    var OnResizeEvent = (function (_super) {
        __extends(OnResizeEvent, _super);
        function OnResizeEvent() {
            _super.call(this);
        }
        var d = __define,c=OnResizeEvent,p=c.prototype;
        return OnResizeEvent;
    }(ls.BaseEvent));
    ls.OnResizeEvent = OnResizeEvent;
    egret.registerClass(OnResizeEvent,'ls.OnResizeEvent');
    var IsFullscreenEvent = (function (_super) {
        __extends(IsFullscreenEvent, _super);
        function IsFullscreenEvent() {
            _super.call(this);
        }
        var d = __define,c=IsFullscreenEvent,p=c.prototype;
        return IsFullscreenEvent;
    }(ls.BaseEvent));
    ls.IsFullscreenEvent = IsFullscreenEvent;
    egret.registerClass(IsFullscreenEvent,'ls.IsFullscreenEvent');
    var IsPortraitLandscapeEvent = (function (_super) {
        __extends(IsPortraitLandscapeEvent, _super);
        function IsPortraitLandscapeEvent() {
            _super.call(this);
        }
        var d = __define,c=IsPortraitLandscapeEvent,p=c.prototype;
        return IsPortraitLandscapeEvent;
    }(ls.BaseEvent));
    ls.IsPortraitLandscapeEvent = IsPortraitLandscapeEvent;
    egret.registerClass(IsPortraitLandscapeEvent,'ls.IsPortraitLandscapeEvent');
    var IsSupportFullscreenEvent = (function (_super) {
        __extends(IsSupportFullscreenEvent, _super);
        function IsSupportFullscreenEvent() {
            _super.call(this);
        }
        var d = __define,c=IsSupportFullscreenEvent,p=c.prototype;
        return IsSupportFullscreenEvent;
    }(ls.BaseEvent));
    ls.IsSupportFullscreenEvent = IsSupportFullscreenEvent;
    egret.registerClass(IsSupportFullscreenEvent,'ls.IsSupportFullscreenEvent');
})(ls || (ls = {}));
