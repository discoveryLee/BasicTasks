//被观察者抽象类Subject
/*class Subject {

    constructor(name, set) {
            this.name = name;
            this.set = set;
        }
        //增加订阅者
    subscribe(observer) {
            this.set.add(observer);
        }
        //移除订阅者
    unsubscribe(observer) {
            this.set.delete(observer);
        }
        //给订阅者发消息
    notify() {
        for (let item of this.set) {
            item.update();
        }
    }
}
//观察者抽象类
class Observer {
    constructor(name) {
            this.name = name;
        }
        //更新状态
    update() {
        console.log(this.name + " has been notified!")
    }
}
let subject1 = new Subject("subject1", new Set());
let observer1 = new Observer("observer1", new Set());
let observer2 = new Observer("observer2", new Set());
let observer3 = new Observer("observer3", new Set());
subject1.subscribe(observer1);
subject1.subscribe(observer2);
subject1.subscribe(observer3);
subject1.notify();*/
//========================================================================
var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
//var i = 1;
var commander; //指挥官
var space;
var mediator;
var ctx;
var cacheCtx; //缓存画布
var shipWidth;
var shipHeight;
var distance;
var consoledom; //控制台
var intervals = [];
var infoBan; //信息面板
window.onload = function() {
    //初始化
    consoledom = document.getElementsByClassName("console")[0];
    commander = new Commander();
    infoBan = document.getElementsByClassName("info-ban")[0];
    //this.console.log(commander.count);
    space = new Space();
    space.run();
    mediator = new Mediator();
    document.getElementById("newShip").addEventListener('click', function() {
        commander.commandNewShip();
    }, false);


    WINDOW_WIDTH = document.body.clientWidth;
    WINDOW_HEIGHT = document.body.clientHeight;
    let canvas = document.getElementById("canvas");
    canvas.width = WINDOW_WIDTH * .75;
    canvas.height = WINDOW_HEIGHT * .8;
    ctx = canvas.getContext("2d");

    cacheCanvas = document.createElement("canvas");
    cacheCanvas.width = WINDOW_WIDTH * .75;
    cacheCanvas.height = WINDOW_HEIGHT * .8;
    cacheCtx = cacheCanvas.getContext("2d"); //生成缓存画布

    drawBackground(ctx);
    shipWidth = 40;
    shipHeight = 20;
    distance = 40; //轨道间距离
};
//信息面板
function log(info) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(info))
    infoBan.appendChild(div);
}
//绘制宇宙和轨道
function drawBackground(ctx) {
    //绘制行星,位于canvas的中心
    ctx.beginPath();
    ctx.arc(canvas.width * .5, canvas.height * .5, 50, 0, 2 * Math.PI);
    ctx.closePath();

    ctx.fillStyle = "#00f";
    ctx.fill();
    //绘制轨道
    for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.arc(canvas.width * .5, canvas.height * .5, 50 + i * 40, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.strokeStyle = "#aaa";
        ctx.stroke();
    }

}
//绘制飞船
function makeShipDomCore(ship) {
    let x = -shipWidth * .5;
    let y = -50 - 1 * 40 - shipHeight;
    //ctx.save(); //保存
    console.log("x:" + x + " " + "y:" + y);
    let r = shipHeight / 2;
    ctx.beginPath();
    //ctx.rotate(Math.PI * .5);
    ctx.moveTo(x, y);
    ctx.lineTo(x + shipWidth, y);

    ctx.arc(x + shipWidth, y + r, r, 1.5 * Math.PI, 0.5 * Math.PI);

    ctx.moveTo(x + shipWidth, y + shipHeight);
    ctx.lineTo(x, y + shipHeight);

    ctx.arc(x, y + r, r, 0.5 * Math.PI, 1.5 * Math.PI);

    ctx.fillStyle = "#aaa";
    ctx.fill();

    ctx.beginPath();
    ctx.font = "16px Arial";
    // ctx.textAlign = "center";
    // ctx.textBadeLine = "middle";
    ctx.fillStyle = "#0f0";
    ctx.fillText(Math.round(ship.energy), x + shipWidth * .2, y + shipHeight * .8);
    //ctx.restore(); // 恢复canvas的状态，然后重绘下一帧 
}

//========飞船飞行======
//圆的标准方程:(x-canvas.width*0.5)^2+(y-canvas.height*0.5)^2=(50+i*distance)^2
function makeShipDom(ship) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx);
    //ctx.restore();
    //ctx.drawImage(cacheCanvas, 0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.translate(canvas.width * .5, canvas.height * .5); //更新canvas的原点(0,0)
    //let rad = 2 * Math.PI / 120 * i;
    //i = i + 1;
    ctx.rotate(ship.deg); //弧度
    //ctx.restore();
    //if (i > 6000)
    //i = i % 120;
    //console.log("rad:" + " " + rad);
    makeShipDomCore(ship);
    ctx.restore(); // 恢复canvas的状态，然后重绘下一帧 


    //ctx.drawImage(cacheCanvas, 0, 0, canvas.width, canvas.height); //将缓存画布内容复制到屏幕画布上
    //cacheCtx.clearRect(0, 0, canvas.width, canvas.height); //每次更新清空缓存画布
}


function Ship(id, dom) {
    this.id = id; //飞船编号
    this.looksdom = dom; //飞船的样子
    this.isflying = false;
    this.energy = 100; //能源
    this.speed = 15; //飞行速度
    this.consume = 5; //能源消耗速率
    this.produce = 2; //能源产生速率
    this.deg = 0; //飞船的位置
    this.degv = 1; //飞行速度
    //this.fly = fly; //动力系统
    //this.selfDestroy = destroy; //自爆系统
    //this.signalProcessing = signalProcessing; //信息接收处理系统
}
Ship.prototype.update = function(time) {
        //console.log('time', time);
        //宇宙来更新飞船消息 time宇宙经过的时间

        //补充能量
        this.energy += this.produce * (time / 1000);
        if (this.energy > 100) {
            this.energy = 100;
        }
        //消耗能量
        if (this.isflying) {
            this.energy -= this.consume * (time / 1000);
            this.deg += this.degv * (time / 10000); //位置变换
            this.deg %= 2 * Math.PI; //弧度
        }


        //能量消耗完毕，停止运行
        if (this.energy <= 0) {
            this.isflying = false;
            this.energy = 0;
        }
        //this.looksdom.update(this); //更新飞船视图
        //makeShipDomCore(shipId);
    }
    //开始飞行
Ship.prototype.start = function() {
        console.log("start====");
        if (this.isflying) {
            log("error:飞船" + this.id + "正在飞行");
        } else {
            log("success:飞船" + this.id + "飞行成功");
            intervals[this.id] = self.setInterval(flight(this), 500);
        }
        this.isflying = true;
    }
    //停止飞行
Ship.prototype.stop = function() {
        if (!this.isflying) {
            log("error:飞船" + this.id + "已停止");
        } else {
            log("success:飞船" + this.id + "停飞成功");

            intervals[this.id] = null;
        }
        this.isflying = false;
    }
    //飞船销毁
Ship.prototype.destroy = function() {
        self.clearInterval(intervals[this.id]); //只要没有被销毁，就会一直update
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //cacheCtx.clearRect(0, 0, canvas.width, canvas.height);
        destroyShip(this);
        drawBackground(ctx);
    }
    //接收消息
Ship.prototype.receive = function(msg) {
        console.log("receive");
        var message = JSON.parse(msg);
        if (message.id != this.id) { //消息主体不对，抛弃消息
            console.log("消息主体不对，抛弃消息");
            return;
        }
        //执行命令
        if (message.command == 'start') {
            this.start();
        } else if (message.command == 'stop') {
            this.stop();
        } else if (message.command == 'destroy') {
            this.destroy();
        } else {
            log("error", "无效命令指令： " + message.command);
        }
    }
    //宇宙时间线
function Space() {
    this.objects = [];
    this.islive = false;
}
//对象出生
Space.prototype.addObject = function(obj) {
        this.objects.push(obj);
    }
    //对象消亡
Space.prototype.removeObject = function(obj) {
        var pos = this.objects.indexOf(obj);
        if (pos != -1) {
            this.objects.splice(pos, 1) //splice(start,deleteCount,item1,item2)
        }
    }
    //宇宙运行
Space.prototype.run = function() {
        var timespace = 100; //时间是不连续的
        var that = this;
        //宇宙诞生
        this.islive = true;

        function mainloop() { //宇宙每天都要工作
            that.objects.forEach(function(obj) {
                obj.update(timespace); //万事万物随时间变化
            });
            if (that.islive) {
                setTimeout(mainloop, timespace); //宇宙每100ms巡视一次
            }
        }
        mainloop();
    }
    //宇宙停止运行
Space.prototype.stop = function() {
        this.islive = false;
    }
    //传输介质
function Mediator() {
    this.subscribes = [];
}
//发布消息
Mediator.prototype.publish = function(msg) {
        var rand = Math.random();
        if (rand < 0.3) { //消息丢失模拟
            log("发布的消息丢失...");
            return;
        }
        var that = this;
        //延时1000ms后通知接收者
        setTimeout(function() {
            that.subscribes.forEach(function(item) {
                //console.log("item", item);
                item.receive(msg);
            });
        }, 1000);
    }
    //添加消息接收者(订阅者)
Mediator.prototype.addSubscriber = function(obj) {
        this.subscribes.push(obj);
    }
    //移除消息接收者
Mediator.prototype.removeSubscriber = function(obj) {
        var pos = this.subscribes.indexOf(obj);
        if (pos != -1) {
            this.subscribes.splice(pos, 1);
        }
    }
    //指挥官
function Commander() {
    this.notebook = {}; //记录着飞船的信息,对象
    this.count = 0; //已发射飞船的数量
}
//下达【开始飞行】命令
Commander.prototype.commandRun = function(shipId) {
        log("对飞船" + shipId + "下达飞行命令");
        var msg = {
            id: shipId,
            command: 'start'
        }
        mediator.publish(JSON.stringify(msg));
        //记录当前飞船状态，并修改控制面板
        var shipstate = this.notebook[shipId];
        shipstate[0] = true;
        shipstate[1].childNodes[1].disabled = shipstate[0];
        shipstate[1].childNodes[2].disabled = !shipstate[0];
    }
    //下达【停止飞行】命令
Commander.prototype.commandStop = function(shipId) {
        log("对飞船" + shipId + "下达停止飞行命令");
        var msg = {
            id: shipId,
            command: 'stop'
        }
        mediator.publish(JSON.stringify(msg));
        //记录当前飞船状态，并修改控制面板
        var shipstate = this.notebook[shipId];
        shipstate[0] = false;
        shipstate[1].childNodes[1].disabled = shipstate[0];
        shipstate[1].childNodes[2].disabled = !shipstate[0];

    }
    //下达【销毁】命令
Commander.prototype.commandDestroy = function(shipId) {
        log("对飞船" + shipId + "下达销毁命令");
        var msg = {
            id: shipId,
            command: 'destroy'
        }
        mediator.publish(JSON.stringify(msg));
        //清空控制面板
        consoledom.removeChild(this.notebook[shipId][1]);
        this.notebook[shipId] = null;
        this.count--;
    }
    //发射新的飞船
Commander.prototype.commandNewShip = function() {
        console.log("this", this);
        if (this.count >= 4) {
            log("info:不能再发射新的飞船了");
            return;
        }
        this.count++;
        //创建飞船
        var shipId = random(0, 100);
        while (!(this.notebook[shipId] == null || this.notebook[shipId] == undefined)) {
            shipId = random(0, 100); //生成一个不存在的shipId
        }
        createShip(shipId);

        // 创建飞船控制面板
        var shipcommand = window.makeCommandDom(shipId); // 创建飞船视图
        consoledom.appendChild(shipcommand);
        this.notebook[shipId] = [false, shipcommand]; // 当前飞行状态和控制面板状态
        //console.log("success", "发射了飞船" + shipId);
        log("success:发射了飞船" + shipId);
    }
    // 生成a,b的随机数
function random(a, b) {
    return Math.floor(Math.random() * (b - a)) + a;
}
//创建飞船shipId的操控面板
window.makeCommandDom = function(shipId) {
        commandDom = document.createElement('div');
        commandDom.id = shipId;
        commandDom.appendChild(document.createTextNode("对飞船" + shipId + "下达命令"));

        //开始飞行按钮
        var buttonStart = document.createElement("input");
        buttonStart.type = "button";
        buttonStart.value = "开始飞行";
        buttonStart.addEventListener('click', function() {
            commander.commandRun(shipId);
        }, false);
        commandDom.appendChild(buttonStart);

        //停止飞行按钮
        var buttonStop = document.createElement("input");
        buttonStop.type = "button";
        buttonStop.value = "停止飞行";
        buttonStop.addEventListener('click', function() {
            commander.commandStop(shipId);
        }, false);
        commandDom.appendChild(buttonStop);

        //销毁按钮
        var buttonDestroy = document.createElement("input");
        buttonDestroy.type = "button";
        buttonDestroy.value = "销毁";
        buttonDestroy.addEventListener('click', function() {
            commander.commandDestroy(shipId);
        }, false);
        commandDom.appendChild(buttonDestroy);
        return commandDom;
    }
    //创建飞船
function createShip(shipId) {

    //shipDom.id = shipId;
    var ship = new Ship();
    ship.id = shipId;
    makeShipDom(ship);
    //spacedom.appendChild(shipDom);
    space.addObject(ship);
    mediator.addSubscriber(ship);
    log("info:" + "飞船" + ship.id + "主体创建完毕");

}
//飞船飞行
function flight(ship) {
    return function() {
        makeShipDom(ship);
    }
}
//销毁飞船
function destroyShip(ship) {
    space.removeObject(ship);
    //spacedom.removeChild(ship.looksdom);
    mediator.removeSubscriber(ship.id);
    log("info:飞船" + ship.id + "主体销毁完毕");
}