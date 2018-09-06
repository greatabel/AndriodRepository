var canvas, stage, exportRoot;
    var level=1
    var mcScale=1
    var yesAns=0
    var isDown=false
    function init() {
        $(".redBlueBtn").click(function(){
            $(".select").hide()
            $("#instruction1").show();
            $("#instructions").css("background-image","none");
            $("#instructions").css("background-size","auto 100%");
            $("#instructions").css("background-repeat","no-repeat");
            $("#instructions").css("background-position","top center");
            $("#instructions").css("margin-left","auto");
            $("#instructions").css("margin-right","auto");
        })
        $(".blueRedBtn").click(function(){
            $(".select").hide();
            $("#instruction1").show();
            $("#instructions").css("background-image","none");
            $("#instructions").css("background-size","auto 100%");
            $("#instructions").css("background-repeat","no-repeat");
            $("#instructions").css("background-position","top center");
            $("#instructions").css("margin-left","auto");
            $("#instructions").css("margin-right","auto");
        })
            $(".start").click(function(){
                $("#instruction1").hide();
                $("#demo").show();
                $(".start").hide();
                $(".start_1").show();
                playMusic();
            })
            $(".start_1").click(function(){
                $("#instruction1").hide();
                $("#demo").show();
            })
            $(".question2").click(function(){
                $("#demo").hide()
                $("#instruction1").show()
            })
            $(".say").click(function(){
                $("#demo").hide();
                $("#instruction1").show()
            })
             $(".reset").click(function(){
            $(".select").show()
            $("#demo").hide()
        })
        window. queue = new createjs.LoadQueue();
        window.queue.installPlugin(createjs.Sound);
        window.queue.addEventListener("complete");
        window.queue.loadManifest([
            {id: "success", src: "../../../static/music/nzb.mp3"},
            {id: "bgc", src: "../../../static/music/bg/s31.mp3"},
            {id: "fail", src: "../../../static/music/fail.mp3"},
            
            // { id: "1", src: "../src/superMan/1.png"},
            // { id: "2", src: "../src/superMan/3.png"},
            // { id: "3", src: "../src/superMan/4.png"},
        ])
        function playMusic() {
            createjs.Sound.play("bgc", createjs.Sound.INTERRUPT_NONE,0,0,-1,.5,0);  
            //  createjs.Sound.play("success", createjs.Sound.INTERRUPT_NONE,0,0,0,.5,0); //调用一次
        }
        
        var loadingValue = $("#loading span");
            window.queue.on("progress", function(ev){
                // console.log(ev.progress);
                loadingValue.text((ev.progress * 100).toFixed() + "%")
                if (ev.progress == 1) {
                    $("#loading").hide();
                }
            })
        canvas = document.getElementById("canvas"); 
        var context = canvas.getContext("2d");
        context.globalCompositeOperation = "darken";
        stage = new createjs.Stage(canvas);
        testCanvas=new createjs.Container();/*创建容器*/
        stage.addChild(testCanvas);/*把容器加入舞台*/
        testCanvas1=new createjs.Container();/*创建容器*/
        stage.addChild(testCanvas1);/*把容器加入舞台*/
        stage.addChild(testCanvas);/*把容器加入舞台*/
        var bitmap0=new createjs.Bitmap("../src/superMan/22.png"); /*hong*/
        var bitmap4=new createjs.Bitmap("../src/superMan/88.png");
        var levelImg = new createjs.Bitmap("../src/superMan/level.png");
        levelImg.x = 1070;levelImg.y= 10;
        levelImg.scaleX = levelImg.scaleY = 0.9;
        // stage.addChild(levelImg);
        bitmap0.x = 1;bitmap0.y = 1;
        testCanvas1.addChild(bitmap0);
        bitmap4.scaleX = 0.13; bitmap4.scaleY = 0.13;
        createjs.Touch.enable(stage);
        stage.enableMouseOver();
        bitmapdong=new createjs.Bitmap("../src/superMan/88.png") /*创建蓝色边框*/

        // bitmaptarget=new createjs.Bitmap("../src/superMan/"+ parseInt(Math.random()*3,10)+".png") // 红色动物
        bitmaptarget=new createjs.Bitmap("../src/superMan/"+parseInt(Math.random()*7,10)+".png");
        console.log(parseInt(Math.random()*3,10));
        
        function ani6(child) {
            createjs.Tween.get(child).to({alpha: 0}, 50).to({alpha: 1}, 50).call(function() {ani6(child)});
        }
        ani6(bitmapdong)
        function an3(child,alpha1,alpha2,x1,x2,t1,t2) {
            createjs.Tween.get(child).to({alpha: alpha1, x: x1}, t1).to({alpha: alpha2, x: x2},t2).call(function() {an3(child,alpha1,alpha2,x1,x2,t1,t2)});
        }
        an3(bitmap4,0,1,460,460,600,600) 
        stage.addChild(bitmapdong)
        stage.addChild(bitmaptarget)
        stage.addEventListener("stagemouseup",stageMouseUpEvent)
        stage.addEventListener("stagemousedown",stageMouseDownEvent)
        createjs.Ticker.setFPS(60);	
        createjs.Ticker.addEventListener("tick", stageTick);
        reSet()
        }
        function stageMouseDownEvent(e){
            stage.removeEventListener("stagemousedown",stageMouseDownEvent)
            bitmapdong.x=stage.mouseX
            bitmapdong.y=stage.mouseY
            stage.addEventListener("stagemousemove",stageMouseMoveEvent)
        }
        function stageMouseMoveEvent(e){
            bitmapdong.regX=bitmapdong.image.width/2;
            bitmapdong.regY=bitmapdong.image.height/2;
            bitmapdong.x=stage.mouseX
            bitmapdong.y=stage.mouseY
        }
        function stageTick(e){
            stage.update();  	
        }
        function stageMouseUpEvent(e){
            stage.addEventListener("stagemousedown",stageMouseDownEvent)
            stage.removeEventListener("stagemousemove",stageMouseMoveEvent)
            if(getDis({x:bitmapdong.x,y:bitmapdong.y},{x:bitmaptarget.x,y:bitmaptarget.y})<=10*mcScale/level+3){
            yesAns+=1;
            createjs.Sound.play("success", createjs.Sound.INTERRUPT_NONE,0,0,0,.5,0);
            showSuccess()
            if(yesAns>=3){
            level+=1
            console.log("成功")
            reSet()
            initSet()
            createjs.Sound.play("success", createjs.Sound.INTERRUPT_NONE,0,0,0,.5,0);
            return
            }
            initSet()
            }
        else{
        level-=1
        console.log("失败")
        initSet()
        createjs.Sound.play("fail", createjs.Sound.INTERRUPT_NONE,0,0,0,.5,0);
        showFail()
        if(level<1){
            level=1
        }
        reSet()
        }
        }
        function initSet(){
            bitmapdong.x=Math.floor(Math.random() * 700)+200
            bitmapdong.y=Math.floor(Math.random() * 300)+200
            bitmaptarget.regX=231.5        
            bitmaptarget.regY=271.5
        }
        function reSet(){
        yesAns=0
        bitmaptarget.scaleX=bitmaptarget.scaleY=mcScale/level*0.45*1;
        bitmapdong.scaleX= bitmapdong.scaleY=mcScale/level*0.5;
        /*exportRoot.txt.text="等级："+level*/
        count=document.getElementById("count")
        count.innerHTML=level;
        bitmaptarget.x=630;
         bitmaptarget.y=320;
         bitmaptarget.regX=231.5;
         bitmaptarget.regY=271.5;
        }
        //算出两点间距离
        function getDis(p1,p2){
            var dx,dy,temp
            dx=p1.x-p2.x
            dy=p1.y-p2.y
            return  Math.sqrt(dx*dx+dy*dy)
        }
        function showSuccess(){
            var success = $("#success");
            var fail = $("#fail");
           
            success.show();

            setTimeout(function(){
            success.hide();
            }, 800)
        }
        function showFail(){
            var fail = $("#fail");
            fail.show()
            setTimeout(function(){
            fail.hide();
            }, 800)
        }
