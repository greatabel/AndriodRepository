"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GamePads = (function () {
    function GamePads(config) {
        _classCallCheck(this, GamePads);

        this.controllers = [];
        this.padMap = config.padMap;
        this.keyMap = config.keyMap ? config.keyMap : {};
        this.oldKeyMap = {};
        this.deadZone = config.deadZone;
    }

    // let padMap = {
    //     buttons: {
    //         2: 37,//X->left
    //         3: 38,//Y->up
    //         1: 39,//B->right
    //         0: 40 //A->down
    //     },
    //     axes: {
    //         0: 'x0',
    //         1: 'y0',
    //         2: 'x1',
    //         3: 'y1'
    //     }
    // }

    // keyMap = {}
    // let config = {
    //     padMap: padMap,
    //     keyMap: keyMap,
    //     deadZone: 0.01
    // }
    // window.gamePad = new GamePads(config)

    // function update() {
    //     if (window.gamePad) window.gamePad.update()
    //     window.requestAnimationFrame(() => {
    //         update()
    //     })
    // }

    // update()

    _createClass(GamePads, [{
        key: "update",
        value: function update() {
            var _this = this;

            this.scanGamePads();
            Object.assign(this.oldKeyMap, this.keyMap);
            this.controllers.forEach(function (controller) {
                for (var i = 0; i < controller.buttons.length; i++) {
                    var keyCode = _this.padMap.buttons[i];
                    if (keyCode) {
                        var padBtn = controller.buttons[i];
                        _this.keyMap[keyCode] = padBtn.pressed ? padBtn.value : 0;
                    }
                }

                for (var i = 0; i < controller.axes.length; i++) {
                    if (!_this.padMap.axes) return;
                    if (_this.padMap.axes[i]) {
                        var value = controller.axes[i];
                        if (Math.abs(value) < _this.deadZone) {
                            _this.keyMap[_this.padMap.axes[i]] = 0;
                        } else {
                            var sign = value > 0 ? 1 : -1;
                            _this.keyMap[_this.padMap.axes[i]] = (Math.abs(controller.axes[i]) - _this.deadZone) * sign;
                        }
                    }
                }
            });
        }
    }, {
        key: "scanGamePads",
        value: function scanGamePads() {
            var gamepads = navigator.getGamepads();
            for (var i = 0; i < gamepads.length; i++) {
                if (gamepads[i]) {
                    if (!(gamepads[i].index in this.controllers)) {
                        this.addgamepad(gamepads[i]);
                    } else {
                        this.controllers[gamepads[i].index] = gamepads[i];
                    }
                }
            }
        }
    }, {
        key: "addgamepad",
        value: function addgamepad(gamepad) {
            this.controllers[gamepad.index] = gamepad;
        }
    }, {
        key: "justPressed",
        value: function justPressed(key) {
            return this.keyMap[key] && !this.oldKeyMap[key];
        }
    }, {
        key: "pressed",
        value: function pressed(key) {
            return this.keyMap[key];
        }
    }, {
        key: "justRelesed",
        value: function justRelesed(key) {
            return !this.keyMap[key] && this.oldKeyMap[key];
        }
    }]);

    return GamePads;
})();