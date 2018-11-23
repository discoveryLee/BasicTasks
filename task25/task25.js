let table = document.getElementById("table");
let command = document.getElementById("command");
let exeBtn = document.getElementById("exe-btn");
let convGo = document.getElementById("btn-go");
let convLef = document.getElementById("btn-lef");
let convRig = document.getElementById("btn-rig");
let convBac = document.getElementById("btn-bac");
let square;
//小方块
function Square(r, c, d) {
    this.rowIdx = r; //0~9
    this.colIdx = c; //0~9
    this.dom = getCellDom(r, c);
    this.direction = d;
    this.dom.className = this.direction;
}

window.onload = function() {
    square = new Square(5, 5, "up");
    exeBtn.addEventListener('click', callback, false);
    convGo.addEventListener('click', moveTo, false);
    convLef.addEventListener('click', tunLef, false);
    convRig.addEventListener('click', tunRig, false);
    convBac.addEventListener('click', tunBac, false);
}

function moveTo() {
    let curDirection = square.direction;
    if (curDirection == "up") {
        square.dom.className = ""; //移除上一个square的classname
        let r = square.rowIdx - 1 < 0 ? 0 : square.rowIdx - 1; //边界控制
        square = new Square(r, square.colIdx, curDirection);
    } else if (curDirection == "down") {
        square.dom.className = "";
        let r = square.rowIdx + 1 > 9 ? 9 : square.rowIdx + 1;
        square = new Square(r, square.colIdx, curDirection);
    } else if (curDirection == "left") {
        square.dom.className = "";
        let c = square.colIdx - 1 < 0 ? 0 : square.colIdx - 1;
        square = new Square(square.rowIdx, c, curDirection);
    } else { //right
        square.dom.className = "";
        let c = square.colIdx + 1 > 9 ? 9 : square.colIdx + 1;
        square = new Square(square.rowIdx, c, curDirection);
    }
}

function tunLef() {
    let curDirection = square.direction;
    if (curDirection == "up") {
        square.dom.className = "";
        square = new Square(square.rowIdx, square.colIdx, "left");
    } else if (curDirection == "down") {
        square.dom.className = "";
        square = new Square(square.rowIdx, square.colIdx, "right");
    } else if (curDirection == "left") {
        square.dom.className = "";
        square = new Square(square.rowIdx, square.colIdx, "down");
    } else { //right
        square.dom.className = "";
        square = new Square(square.rowIdx, square.colIdx, "up");
    }
}

function tunRig() {
    let curDirection = square.direction;
    if (curDirection == "up") {
        square.dom.className = "";
        square = new Square(square.rowIdx, square.colIdx, "right");
    } else if (curDirection == "down") {
        square.dom.className = "";
        square = new Square(square.rowIdx, square.colIdx, "left");
    } else if (curDirection == "left") {
        square.dom.className = "";
        square = new Square(square.rowIdx, square.colIdx, "up");
    } else { //right
        square.dom.className = "";
        square = new Square(square.rowIdx, square.colIdx, "down");
    }
}

function tunBac() {
    let curDirection = square.direction;
    if (curDirection == "up") {
        square.dom.className = "";
        square = new Square(square.rowIdx, square.colIdx, "down");
    } else if (curDirection == "down") {
        square.dom.className = "";
        square = new Square(square.rowIdx, square.colIdx, "up");
    } else if (curDirection == "left") {
        square.dom.className = "";
        square = new Square(square.rowIdx, square.colIdx, "right");
    } else { //right
        square.dom.className = "";
        square = new Square(square.rowIdx, square.colIdx, "left");
    }
}

function callback() {
    switch (command.value) {
        case "GO": //向蓝色边所面向的方向前进一格
            moveTo();
            break;
        case "TUN LEF": //逆时针旋转90度
            tunLef();
            break;
        case "TUN RIG": //顺时针旋转90度
            tunRig();
            break;
        case "TUN BAC": //旋转180度
            tunBac();
            break;
        default:
            console.log("错误指令");
    }
}

function getCellDom(rowIdx, colIdx) {
    return table.rows[rowIdx].cells[colIdx];
}