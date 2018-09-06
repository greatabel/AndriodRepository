$(window).ready(function(){
    class BloomBG {
        constructor(config){
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

        buildContent(){
            this.flower = new createjs.Shape();
            this.fillCmd = this.flower.graphics.beginFill(this.colors[0]).command;
            this.flower.graphics.drawPolyStar(0,0,300,12,0.85);
            this.flower.set({
                x: this.stage.canvas.width/2,
                y: this.stage.canvas.height/2
            });

            this.stage.addChild(this.flower);

            let t = createjs.Tween.get(this.fillCmd, {loop:true, bounce:true});

            for(let i = 1; i < this.colors.length; i++) {
                t.to({style: this.colors[i]}, this.time);
            }

            createjs.Tween.get(this.flower, {loop:true, bounce:true}).to({alpha:0.3, scaleX:0.2, scaleY:0.2})
            .to({rotation:360, scaleX:3, scaleY:3}, 3300, createjs.Ease.quadInOut);
        }

        render(){
            this.stage.update();
            if(this.stopValue||this.pauseValue) return;

            window.requestAnimationFrame(()=>{
                this.render();
            })
        }

        stop() {
            this.stopValue = true;
        }

        pause() {
            this.pauseValue = true;
        }

        continue() {
            if(this.pauseValue) {
                this.pauseValue = false;
                this.render()
            }
        }

        removeSelf(){
            this.stop();
            this.stage.autoClear = true;
            this.stage.removeAllChildren();
            this.stage.removeAllEventListeners();
            this.stage.update();
        }
    }

    window.BloomBG = BloomBG;
})