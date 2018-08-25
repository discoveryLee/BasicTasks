 //设置兄弟节点的可见性
 function setBrotherNodeVisibility(curNode) {
     let childArray = curNode.parentNode.children;
     for (let i = 0; i < childArray.length; i++) {
         if (childArray[i] !== curNode) {
             if (childArray[i].className === "nodebody-visible") {
                 childArray[i].className = "nodebody-hidden";

             } else {
                 childArray[i].className = "nodebody-visible";
                 curNode.firstChild.className = "down-arrow";
             }
         }
     }
 }
 //设置父节点前面的图标
 function setIconOpenOrClose(curNode) {
     if (curNode.children[0].className === "right-arrow") {
         curNode.children[0].className = "down-arrow";
     } else {
         curNode.children[0].className = "right-arrow";
     }
 }
 // document.getElementsByClassName("a");
 document.addEventListener('click', confirmTarget, false);

 function confirmTarget() {
     console.log("confirmTarget");
     e = event || window.event;
     let Tag = e.target.tagName;
     if (Tag === "A") {
         console.log("A");
         setBrotherNodeVisibility(e.target);
         setIconOpenOrClose(e.target);
     }
 }