function regEvent(ele, eventName, fun) {
    if (window.attachEvent)
        ele.attachEvent(eventName, fun);  //IE浏览器  
    else {
        eventName = eventName.replace(/^on/, "");   //如果on开头，删除on，如onclick->click  
        ele.addEventListener(eventName, fun, false);  //非IE浏览器  
    }
}

export default regEvent