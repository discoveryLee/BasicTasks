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
var interval;
var infoBan; //信息面板
var powerRadio; //动力系统选择
var energyRadio; //能源系统选择
window.onload = function() {
    //初始化
    consoledom = document.getElementsByClassName("console")[0];
    commander = new Commander();
    infoBan = document.getElementsByClassName("info-ban")[0];
    //this.console.log(commander.count);
    mediator = new Mediator();
    space = new Space();
    space.addObject(mediator); //宇宙帮忙更新
    space.run();
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

    powerRadio = document.getElementsByName("power-system");
    energyRadio = document.getElementsByName("energy-system");
    drawBackground(ctx);
    shipWidth = 40;
    shipHeight = 20;
    distance = 40; //轨道间距离
};
//信息面板
function log(info) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(info));
    infoBan.appendChild(div);
    if (infoBan.childNodes.length > 20) //最多显示20条log
        infoBan.removeChild(infoBan.childNodes[0]);
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
    let y = -50 - ship.orbit * 40 - shipHeight;
    cacheCtx.save(); //保存
    //console.log("x:" + x + " " + "y:" + y);
    let r = shipHeight / 2;
    cacheCtx.beginPath();
    //ctx.rotate(Math.PI * .5);
    cacheCtx.moveTo(x, y);
    cacheCtx.lineTo(x + shipWidth, y);

    cacheCtx.arc(x + shipWidth, y + r, r, 1.5 * Math.PI, 0.5 * Math.PI);

    cacheCtx.moveTo(x + shipWidth, y + shipHeight);
    cacheCtx.lineTo(x, y + shipHeight);

    cacheCtx.arc(x, y + r, r, 0.5 * Math.PI, 1.5 * Math.PI);

    cacheCtx.fillStyle = "#aaa";
    cacheCtx.fill();

    cacheCtx.beginPath();
    cacheCtx.font = "16px Arial";
    // ctx.textAlign = "center";
    // ctx.textBadeLine = "middle";
    cacheCtx.fillStyle = "#0f0";
    cacheCtx.fillText(Math.round(ship.energy), x + shipWidth * .2, y + shipHeight * .8);
    cacheCtx.restore(); // 恢复canvas的状态，然后重绘下一帧 

}
//飞船飞行
function makeShipDom(shipArray) {
    //log(shipArray.length);
    //console.log("shipArray", shipArray);
    if (shipArray != null && shipArray.length > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        shipArray.forEach(function(obj) {

            cacheCtx.save(); //保存画布原有状态
            drawBackground(cacheCtx);
            cacheCtx.translate(canvas.width * .5, canvas.height * .5); //更新canvas的原点(0,0)

            cacheCtx.rotate(obj.deg); //弧度

            makeShipDomCore(obj);
            cacheCtx.restore(); // 恢复canvas的状态，然后重绘下一帧 

        });
        ctx.drawImage(cacheCanvas, 0, 0, canvas.width, canvas.height); //将缓存画布内容复制到屏幕画布上
        cacheCtx.clearRect(0, 0, cacheCanvas.width, cacheCanvas.height); //每次更新清空缓存画布
    }
}
//动力系统
function getPowerSystem(id, that) {
    switch (id) {
        case "0":
            that.degv = 3;
            that.consume = 5;
            break;
        case "1":
            that.degv = 5;
            that.consume = 7;
            break;
        case "2":
            that.degv = 8;
            that.consume = 9;
            break;
        default:
    }
}
//能源系统
function getEnergySystem(id, that) {
    switch (id) {
        case "0":
            that.produce = 2;
            break;
        case "1":
            that.produce = 3;
            break;
        case "2":
            that.produce = 4;
            break;
        default:
    }
}

function Ship(id, powerSystemId, energySystemId) {
    this.id = id; //飞船编号
    this.isflying = false;
    this.energy = 100; //能源

    this.deg = 0; //飞船的位置
    //this.degv = 1; //飞行速度
    getPowerSystem(powerSystemId, this); //动力系统
    getEnergySystem(energySystemId, this); //能源系统
    this.orbit = random(1, 4); //飞船轨道
    this.adapter = new Adapter(); // 适配器
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
        if (this.isflying) {
            log("error:飞船" + this.id + "正在飞行");
        } else {
            log("success:飞船" + this.id + "飞行成功");
            self.clearInterval(interval);
            interval = self.setInterval(flight(space.objects), 100); //重启


        }
        this.isflying = true;
    }
    //停止飞行
Ship.prototype.stop = function() {
        if (!this.isflying) {
            log("error:飞船" + this.id + "已停止");
        } else {
            log("success:飞船" + this.id + "停飞成功");

            //intervals[this.id] = null;
            self.clearInterval(interval); //只要没有被销毁，就会一直update
            interval = self.setInterval(flight(space.objects), 100); //重启，以更新space.objects的值
        }
        this.isflying = false;
    }
    //飞船销毁
Ship.prototype.destroy = function() {
        self.clearInterval(interval); //只要没有被销毁，就会一直update
        interval = self.setInterval(flight(space.objects), 100); //重启，以更新space.objects的值
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //cacheCtx.clearRect(0, 0, canvas.width, canvas.height);
        destroyShip(this);
        drawBackground(ctx);
    }
    //接收消息
Ship.prototype.receive = function(msg) {
        msg = this.adapter.decode(msg);

        var message = JSON.parse(msg);
        if (message.id != this.id) { //消息主体不对，抛弃消息
            return;
        }
        mediator.ack(message.ackId); //ackId即publish时包装的msgId
        //console.log("消息" + message.ackId + "发送了ack");
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
    //传输介质(改进后的BUS)
function Mediator() {
    this.subscribes = []; //接收消息的队列
    this.ackList = []; //已经发送还没有ack的数据，格式 [消息id,消息内容,消息发送时间,是否确认]
    this.msgId = 0;
}
//发布消息
Mediator.prototype.publish = function(msg) {
        var data = ((this.msgId << 8) | msg); //将msgId编码包装到消息里
        this.ackList.push([this.msgId, msg, new Date().getTime(), false]);
        //console.log("push之后ackList length：", this.ackList.length);
        this.msgId++;

        var rand = Math.random();

        if (rand < 0.1) {
            log("发布的消息丢失...");
            return;
        }

        var that = this;
        //延时300ms后通知接收者
        setTimeout(function() {
            that.subscribes.forEach(function(item) {
                //console.log("item", item);
                item.receive(data);
            });
        }, 300);
    }
    //确认消息收到
Mediator.prototype.ack = function(ackId) {
    //console.log("ackList", this.ackList);
    for (var i = 0; i < this.ackList.length; i++) {
        if (ackId == this.ackList[i][0]) {
            this.ackList[i][3] = true; //标记为收到ack
            //console.log("消息" + ackId + "收到了ack");
            break;
        }
    }
}
Mediator.prototype.update = function() {
        var republish = [];
        var cnt = 0; //检查到的位置
        for (var i = 0; i < this.ackList.length; i++) {
            if (this.ackList[i][3] == false) {
                if (new Date().getTime() - this.ackList[i][2] > 1000) { // 超时消息，记录下来需要重发
                    republish.push(this.ackList[i]);
                } else {
                    this.ackList[cnt++] = this.ackList[i]; //还在存活期的消息
                }
            }
        }

        //先清理消息，再重发，因为重发时，如果再次失败，会再push；如果这两个代码块顺序对调，重发时新push的也会被清掉
        // 清理无用的消息
        while (this.ackList.length > cnt) {
            //console.log("清理无用消息");
            this.ackList.pop(); //removes the last element from an array 
        }
        //消息重发
        for (var i = 0; i < republish.length; i++) {

            log("未收到ack，重新发送消息...");
            this.publish(republish[i][1]);
        }
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
    //适配器
function Adapter() {}
//将msg转化为二进制指令
Adapter.prototype.encode = function(msg) {
        //console.log("encode之前", msg);
        msg = JSON.parse(msg);
        //console.log(msg);
        var data = msg.id;
        data = data << 4; //相当于乘2的4次方
        switch (msg.command) {
            case "start":
                data = data | 1; //0001
                break;
            case "stop":
                data = data | 2; //0010
                break;
            case "destroy":
                data = data | 12; //1100
                break;
            default:
                log("error command:" + msg);
                return null;
        }
        //console.log("encode之后", data);
        return data;
    }
    //将二进制指令解码
Adapter.prototype.decode = function(msg) {
        var data = {};
        data.ackId = msg >> 8;
        data.id = (msg & 255) >> 4; //msg&255：只取后8位
        switch (msg & 15) {
            case 1: //0001
                data.command = 'start';
                break;
            case 2: //0010
                data.command = 'stop';
                break;
            case 12: //1100
                data.command = 'destroy';
                break;
            default:
                log("error command:" + msg);
                return null;
        }
        //console.log("decode之后：", data);
        return JSON.stringify(data);
    }
    //指挥官
function Commander() {
    this.notebook = {}; //记录着飞船的信息,对象
    this.count = 0; //已发射飞船的数量
    this.adapter = new Adapter(); // 适配器
}
//下达【开始飞行】命令
Commander.prototype.commandRun = function(shipId) {
        log("对飞船" + shipId + "下达飞行命令");
        var msg = {
            id: shipId,
            command: 'start'
        }
        mediator.publish(this.adapter.encode(JSON.stringify(msg)));
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
        mediator.publish(this.adapter.encode(JSON.stringify(msg)));
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
        mediator.publish(this.adapter.encode(JSON.stringify(msg)));
        //清空控制面板
        consoledom.removeChild(this.notebook[shipId][1]);
        this.notebook[shipId] = null;
        this.count--;
    }
    //发射新的飞船
Commander.prototype.commandNewShip = function() {
        //console.log("this", this);
        if (this.count >= 4) {
            log("info:不能再发射新的飞船了");
            return;
        }
        this.count++;
        //创建飞船
        //shipid太大，二进制编码中左移4位就不够了，解码会出错，所以控制在0~3
        var shipId = 0;
        while (!(this.notebook[shipId] == null || this.notebook[shipId] == undefined)) {
            shipId++; //找到未被使用的shipId
        }
        let powerId, energyId;
        for (let i = 0; i < powerRadio.length; i++) {
            if (powerRadio[i].checked) {
                powerId = powerRadio[i].value;
            }
        }
        for (let i = 0; i < energyRadio.length; i++) {
            if (energyRadio[i].checked) {
                energyId = energyRadio[i].value;
            }
        }
        createShip(shipId, powerId, energyId);

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
function createShip(shipId, powerId, energyId) {
    var ship = new Ship(shipId, powerId, energyId);
    space.addObject(ship);
    makeShipDom(space.objects);
    mediator.addSubscriber(ship);
    log("info:" + "飞船" + ship.id + "主体创建完毕");

}
//飞船飞行
function flight(shipArray) {
    return function() {
        makeShipDom(shipArray);
    }
}
//销毁飞船
function destroyShip(ship) {
    space.removeObject(ship);
    //spacedom.removeChild(ship.looksdom);
    mediator.removeSubscriber(ship.id);
    log("info:飞船" + ship.id + "主体销毁完毕");
}