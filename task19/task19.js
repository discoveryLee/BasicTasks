let divList = []; //遍历的节点缓存
let divSelectList = [];
let int;
let val;

//深度优先遍历
function deepFirstTraversal(treeRoot) {
    if (treeRoot !== null) {
        divList.push(treeRoot);
        let arr = [...treeRoot.children];
        if (arr.length > 0)
            arr.map(v => deepFirstTraversal(v));
    }
}
//广度优先遍历
function breadthFirstTraversal(treeRoot) {
    let pos = 0;
    if (treeRoot !== null) {
        divList.push(treeRoot);
        console.log(treeRoot);
        _breadthFirstTraversal(treeRoot, pos);
    }

}
//扫描divList,依次添加其元素的子元素，记录扫描到的位置
function _breadthFirstTraversal(treeRoot, pos) {
    if (treeRoot !== null) {
        let arr = [...treeRoot.children]; //扫描
        pos++;
        arr.map(v =>
            divList.push(v)); //将同一层的节点添加到列表中
        for (let j = pos; j < divList.length; j++)
            _breadthFirstTraversal(divList[j]);
    }

}

function colorChange(index) {
    console.log("index", index);
    if (index !== 0) {
        divList[index - 1].style.cssText = "background-color:'#fff'";
    }
    if (index === divList.length) {
        divList[index - 1].style.cssText = "background-color:'#fff'";
        return;
    }
    let curDiv = divList[index];
    curDiv.style.cssText = "background-color:yellow;";
    //搜索
    if (val != "undefined" && curDiv.childNodes[0].data.trim() == val) {
        alert("found the " + val);
    }

}
let i = 0;

function activeTimer(arr) {
    console.log("arr.length", arr.length);
    //arr.map(v => console.log(v));
    //setTimeout与setInterval调用的函数是不能带参数的,如果你调用函数时传递了参数，那么该函数会立即执行
    int = self.setInterval(_fn(arr), 1000);
}

function fn(arr) {
    colorChange(i++);
    if (i === arr.length + 1) {
        window.clearInterval(int);
        i = 0; //全局变量i重置
        console.log("clearInterval");
    }
}

function _fn(arr) {
    return function() {
        fn(arr)
    };
}

function confirmBtn() {
    var event = event || window.event;
    let targetId = event.target.id;
    let treeNode = document.getElementById("root");
    val = document.getElementById("valueForSearch").value;
    switch (targetId) {
        case "deep-first":
            divList = []; //连续执行时要清空
            deepFirstTraversal(treeNode);
            activeTimer(divList);
            break;
        case "breadth-first":
            divList = []; //连续执行时要清空
            breadthFirstTraversal(treeNode);
            activeTimer(divList);
            break;
        case "delete":
            divSelectList.map(v => {
                let parent = v.parentNode;
                parent.removeChild(v);
            });
            divSelectList = []; //连续执行时要清空
            break;
        case "add":
            let valforAdd = document.getElementById("valueForAdd").value;
            if (valforAdd !== "" && divSelectList.length === 1) {
                let cur = divSelectList.pop();
                var newDiv = document.createElement("div");
                var textNode = document.createTextNode(valforAdd);
                newDiv.appendChild(textNode);
                cur.appendChild(newDiv);
                divSelectList = [];
            }
            break;
        default:
            let active = event.target;
            divSelectList.push(active);
            active.style.cssText = "background-color:blue";
            break;
    }
}

document.addEventListener("click", confirmBtn, false);