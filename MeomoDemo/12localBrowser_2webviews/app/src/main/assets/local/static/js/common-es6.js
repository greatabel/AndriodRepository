const babyEye = {};
function anTarget(bg,lazy,glasses){
    return (bg^lazy)^glasses
}

function steInOut(bg,target,glasses){
    return (bg^target)^glasses
}

babyEye.getParam = (url, name)=>{
    let value = null;
    if(window.location.href.indexOf("?")==-1) return null
    let params = window.location.href.split("?")[1].split('&').forEach((param)=>{
        if(param.split('=')[0] == name){
            value = param.split('=')[1];
        }
    })
    return value;
}

babyEye.average = (arr) => {
    let l = arr.length;
    let sum = arr.reduce((x,y)=>(x+y),0);
    return sum/l;
}

babyEye.distance = (x1,y1,x2,y2) => {
    let dx = Math.abs(x1 - x2);
    let dy = Math.abs(y1 - y2);
    return Math.sqrt(dx*dx+dy*dy);
}

babyEye.disSquare = (x1,y1,x2,y2) => {
    return Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2);
}

babyEye.randomRange = (low, high) => {
    return Math.floor(low + Math.random() * (high - low));
}

babyEye.randomExcept = (low, high, except) => {
    let result = babyEye.randomRange(low, high);
    return result == except? babyEye.randomExcept(low, high, except): result;
}

babyEye.shuffle = (arr) => {
    let i = 0;
    while (i < arr.length) {
        let j = babyEye.randomRange(0, i);
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        i++;
    }
}
//([1,2,3,4,5], 2) -> [[1,2],[3,4],[5]];
babyEye.bundle = (arr, n) => {
    let result = []
    for(let i = 0; i < arr.length; i=i+n) {
        result.push(arr.slice(i,i+n));
    }
    return result;
}

babyEye.reversed = (arr) => {
    let result = [];
    for(let i = arr.length - 1; i >=0; i--) {
        result.push(arr[i]);
    }
    return result;
}

babyEye.inRange = (point, range) => {
    return range[0] < point && point < range[1];
}

//new ImageSTE({image:xxx, colors:["red","blue"], delta:10}) -> image;
class ImageSTE {
    constructor(config){
        if(config.colors.indexOf("r") == -1 || config.colors.indexOf("gb") == -1) return;
        let img = config.image;
        let colors = config.colors;
        let delta = config.delta;
        let canvas = document.getElementById("img-canvas");
        canvas.width = img.width + delta;
        canvas.height = img.height;

        let ctx = canvas.getContext('2d');
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img, colors[0] == "r"? 0:delta, 0);
        let imageDataLeft = ctx.getImageData(0,0,img.width + delta, img.height);
        ctx.clearRect(0,0,canvas.width,canvas.height);

        ctx.drawImage(img, colors[0] == "r"? delta:0, 0);
        let imageDataRight = ctx.getImageData(0,0,img.width + delta, img.height);
        ctx.clearRect(0,0,canvas.width,canvas.height);

        let result = ctx.createImageData(img.width + delta,img.height);
        ctx.clearRect(0,0,canvas.width,canvas.height);

        let dataLength = imageDataRight.data.length;
        for (let i = 0; i < dataLength; i += 4) {
          imageDataRight.data[i] = 0;
        }

        for (let i = 0; i < dataLength; i += 4) {
          imageDataLeft.data[i+1] = 0;
          imageDataLeft.data[i+2] = 0;
        }

        for (let i = 0; i < dataLength; i += 4) {
          result.data[i] = imageDataLeft.data[i];
          result.data[i+1] = imageDataRight.data[i+1];
          result.data[i+2] = imageDataRight.data[i+2];
          result.data[i+3]= imageDataRight.data[i+3] + imageDataLeft.data[i+3];
        }
        ctx.putImageData(result, 0, 0);

        let imgDom = document.createElement("img");
        imgDom.src = canvas.toDataURL("image/png");
        imgDom.width = img.width + delta;
        imgDom.height = img.height;
        return imgDom; 
    }
}

//只取中间像素
class ImageMidSTE {
    constructor(config){
        if(config.colors.indexOf("r") == -1 || config.colors.indexOf("gb") == -1) return;
        let img = config.image;
        let colors = config.colors;
        let delta = config.delta
        let canvas = document.getElementById("img-canvas");
        canvas.width = img.width + delta;
        canvas.height = img.height;

        let ctx = canvas.getContext('2d');
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img, colors[0] == "r"? 0:delta, 0);
        let imageDataLeft = ctx.getImageData(0,0,img.width + delta, img.height);
        ctx.clearRect(0,0,canvas.width,canvas.height);

        ctx.drawImage(img, colors[0] == "r"? delta:0, 0);
        let imageDataRight = ctx.getImageData(0,0,img.width +  delta, img.height);
        ctx.clearRect(0,0,canvas.width,canvas.height);

        let result = ctx.createImageData(img.width + delta,img.height);
        ctx.clearRect(0,0,canvas.width,canvas.height);

        let dataLength = imageDataRight.data.length;
        for (let i = 0; i < dataLength; i += 4) {
          imageDataRight.data[i] = 0;
        }

        for (let i = 0; i < dataLength; i += 4) {
          imageDataLeft.data[i+1] = 0;
          imageDataLeft.data[i+2] = 0;
        }

        for (let i = 0; i < dataLength; i += 4) {
          result.data[i] = imageDataLeft.data[i];
          result.data[i+1] = imageDataRight.data[i+1];
          result.data[i+2] = imageDataRight.data[i+2];
          result.data[i+3]= imageDataRight.data[i+3] && imageDataLeft.data[i+3];
        }
        ctx.putImageData(result, 0, 0);

        let imgDom = document.createElement("img");
        imgDom.src = canvas.toDataURL("image/png");
        imgDom.width = img.width + delta;
        imgDom.height = img.height;
        return imgDom; 
    }
}

class FilteredImg {
    constructor(imgElement,filters) {
        this.img = imgElement;
        this.filters = filters;
        this.canvas = document.getElementById("img-canvas");
        this.stage = new c.Stage("img-canvas");
        c.Touch.enable(this.stage);
        this.buildWorld();
    }

    buildWorld(){
        this.bitmap = new c.Bitmap(this.img);
        this.bitmap.filters = this.filters;
        this.bitmap.cache(0,0,this.bitmap.image.width, this.bitmap.image.height);
        this.stage.addChild(this.bitmap);

        this.canvas.width = this.bitmap.image.width;
        this.canvas.height = this.bitmap.image.height;
        this.stage.update();

        let img = document.createElement("img"); // Create an <img> element
        img.src = this.canvas.toDataURL(); // Set its src attribute
        this.img = img;
    }

    getImg(){
        return this.img;
    }
}

class MinPQ {
    constructor(compare) {
        this.compare = compare;
        this.size = 0;
        this.pq = [null];
    }

    min() {
        return this.pq[1];
    }

    insert(obj) {
        this.size++;
        this.pq.push(obj);
        this.swim(this.size);
        return this.size
    }

    delMin() {
        let min = this.pq[1];
        this.exch(this.size, 1);
        this.size--;
        this.pq.length = this.size + 1;
        this.sink(1);
        return min;
    }

    swim(k) {
        while(k > 1 && this.more(this.divideInt(k,2), k)) {
            let j = this.divideInt(k, 2);
            this.exch(j, k);
            k = j;
        }
    }

    sink(k) {
        while(2 * k <= this.size) {
            let j = 2 * k;
            if(this.pq[j+1] && this.more(j, j + 1)) {
                j++;
            }
            if(!this.more(k, j)) {
                break;
            }
            this.exch(k, j);
            k = j;
        }
    }

    more(k1, k2) {
        return this.compare(this.pq[k1], this.pq[k2]) > 0;
    }

    divideInt(n1,n2) {
        return Math.floor(n1/n2);
    }

    exch(k1,k2) {
        let temp = this.pq[k1];
        this.pq[k1] = this.pq[k2];
        this.pq[k2] = temp;
    }

    reveal() {
        return this.pq;
    }

    isMinPQ() {
        let arr = this.reveal();
        for(let i = 1; i * 2 + 1<= this.size; i++) {
            if (arr[i] <= arr[2*i] && arr[i] <= arr[2*i + 1]) {
                continue;
            } else {
                return false;
            }
        }
        return true;
    }
}

window.handleResize = ()=>{
    if(window.innerWidth < window.innerHeight * 1024/768){
        $("#game-canvas").css({
            "height": "auto",
            "width": "99vw"
        })
    }else {
        $("#game-canvas").css({
            "height": "99vh",
            "width": "auto"
        })
    };
};

window.addEventListener('resize', handleResize, false);
window.handleResize();