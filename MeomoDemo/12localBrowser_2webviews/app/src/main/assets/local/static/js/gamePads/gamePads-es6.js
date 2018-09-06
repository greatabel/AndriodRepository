class GamePads {
    constructor(config) {
        this.controllers = []
        this.padMap = config.padMap
        this.keyMap = config.keyMap? config.keyMap:{}
        this.oldKeyMap = {}
        this.deadZone = config.deadZone
    }

    update() {
        this.scanGamePads()
        Object.assign(this.oldKeyMap, this.keyMap)
        this.controllers.forEach((controller)=>{
            for (let i = 0; i < controller.buttons.length; i++) {
                let keyCode = this.padMap.buttons[i]
                if (keyCode) {
                    let padBtn = controller.buttons[i]
                    this.keyMap[keyCode] = padBtn.pressed? padBtn.value: 0
                }
            }

            for (let i = 0; i < controller.axes.length; i++) {
                if(!this.padMap.axes) return
                if (this.padMap.axes[i]) {
                    let value = controller.axes[i]
                    if(Math.abs(value) < this.deadZone) {
                        this.keyMap[this.padMap.axes[i]] = 0
                    }else {
                        let sign = value > 0? 1:-1
                        this.keyMap[this.padMap.axes[i]] = (Math.abs(controller.axes[i]) - this.deadZone) * sign
                    }
                }
            }
        }) 
    }

    scanGamePads() {
        let gamepads = navigator.getGamepads()
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                if (!(gamepads[i].index in this.controllers)) {
                    this.addgamepad(gamepads[i])
                } else {
                    this.controllers[gamepads[i].index] = gamepads[i]
                }
            }
        }
    }

    addgamepad(gamepad) {
        this.controllers[gamepad.index] = gamepad
    }

    justPressed(key){
        return this.keyMap[key] && !this.oldKeyMap[key]
    }

    pressed(key){
        return this.keyMap[key]
    }

    justRelesed(key){
        return !this.keyMap[key] && this.oldKeyMap[key]
    }
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