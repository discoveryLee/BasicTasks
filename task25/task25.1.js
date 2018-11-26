var objdom = document.getElementById("man");
var command = document.getElementById("command");
var exeBtn = document.getElementById("exe-btn");
var convGo = document.getElementById("btn-go");
var convLef = document.getElementById("btn-lef");
var convRig = document.getElementById("btn-rig");
var convBac = document.getElementById("btn-bac");

function Square(x, y, dom) {
    this.x = x;
    this.y = y;
    this.dom = dom;
    this.direction = 0;
    this.dom.moveTo(this.x, this.y);
}
//GO
Square.prototype.go = function() {
    switch (this.direction) {
        case 0:
            this.x = this.x - 1 < 0 ? 0 : this.x - 1; //边界控制
            break;
        case 90:
            this.y = this.y + 1 > 9 ? 9 : this.y + 1;
            break;
        case 180:
            this.x = this.x + 1 > 9 ? 9 : this.x + 1;
            break;
        case 270:
            this.y = this.y - 1 < 0 ? 0 : this.y - 1;
            break;
        default:
            console.log("未知 direction");
    }
    console.log("this", this);
    this.dom.moveTo(this.x, this.y);
}

Square.prototype.tunLef = function() {
    this.direction -= 90;
    this.direction = (this.direction + 360) % 360;
    this.dom.transform(this.direction);
}

Square.prototype.tunRig = function() {
    this.direction += 90;
    this.direction = (this.direction + 360) % 360;
    this.dom.transform(this.direction);
}

Square.prototype.tunBac = function() {
    this.direction += 180;
    this.direction = (this.direction + 360) % 360;
    this.dom.transform(this.direction);
}

function callback() {
    switch (command.value) {
        case "GO": //向蓝色边所面向的方向前进一格
            square.moveTo();
            break;
        case "TUN LEF": //逆时针旋转90度
            square.tunLef();
            break;
        case "TUN RIG": //顺时针旋转90度
            square.tunRig();
            break;
        case "TUN BAC": //旋转180度
            square.tunBac();
            break;
        default:
            console.log("错误指令");
    }
}
window.onload = function() {

    objdom.moveTo = function(x, y) {
        this.style.top = x * 50 + "px";
        this.style.left = y * 50 + "px";
    }
    objdom.transform = function(deg) {
            this.style.transform = "rotate(" + deg + "deg)";
        }
        //console.log("dom", dom.moveTo);
    var square = new Square(6, 6, objdom);
    exeBtn.addEventListener('click', callback, false);
    convGo.addEventListener('click', function() {
        square.go(); //如果不将square.go()写在匿名函数里，而是直接写square.go,那么go函数里面的额this为convGo
    }, false);
    // convGo.addEventListener('click', square.go, false);
    convLef.addEventListener('click', function() {
        square.tunLef()
    }, false);
    convRig.addEventListener('click', function() {
        square.tunRig()
    }, false);
    convBac.addEventListener('click', function() {
        square.tunBac();
    }, false);
}