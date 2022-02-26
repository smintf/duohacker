document.addEventListener('DOMContentLoaded', function() {

  var activated = false;

  chrome.storage.sync.get("activated", function(items) {
    activated = !!items.activated;
    document.querySelector("#inp").checked = activated;
  });

  chrome.cookies.get({"url": "https://duolingo.com", "name": "jwt_token"}, function(cookie) {
    try {
      document.querySelector('.msg').innerHTML = (parseJwt(cookie.value || '{"sub":""}').sub);
    } catch (e) {
      document.querySelector('.msg').innerHTML = "Log into Duolingo!";
    }
    document.querySelector('.hidden').value = document.querySelector('.msg').innerHTML;
  });

  document.querySelector('.msg').addEventListener("click", ()=>{
    document.querySelector('.hidden').select();
    document.execCommand("copy");
  });


  document.querySelector("#inp").addEventListener("click", () => {
    chrome.storage.sync.set({
      "activated": !activated
    }, function() {
      activated = !activated;
      chrome.runtime.sendMessage({
        msg: "toggle",
        activated: activated
      });
    });
  });

});


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};
