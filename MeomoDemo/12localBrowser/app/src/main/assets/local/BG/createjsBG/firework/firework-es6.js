$(window).ready(()=>{
    class Firework extends createjs.Container {
        constructor() {
            super();
            this.buildFireDots();
            this.r = 100;
        }

        buildFireDots(){
            this.dots = [];
            let color = "rgb("
            + babyEye.randomRange(0,255) + ","
            + babyEye.randomRange(0,255) + ","
            + babyEye.randomRange(0,255) + ")";
            for(let i = 0; i < 30; i++) {
                let dot = new createjs.Shape();
                dot.graphics.beginStroke(color).drawCircle(0,0,1);
                createjs.Tween.get(dot).to({
                    x: 100 * Math.cos(babyEye.randomRange(0, Math.PI * 2)),
                    y: 100 * Math.sin(babyEye.randomRange(0, Math.PI * 2)),
                    scaleX: 3,
                    scaleY: 3
                }, 1000, createjs.Ease.cubicOut).call(()=>{
                    this.removeChild(dot);
                });
                this.addChild(dot);
            }
        }
    }

    window.Firework = Firework;
})