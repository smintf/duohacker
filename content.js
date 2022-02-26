
var roottext = "";


var rootcheck = setInterval(()=>{
  roottext = document.querySelector('#root');
  if(roottext){
    roottext = roottext.innerText;
  }else{
    roottext = "";
  }
  if(roottext != ""){
    clearInterval(rootcheck);
    chrome.runtime.sendMessage({
      msg: "rootDOM",
      text: roottext
    });
  }
},1000);
