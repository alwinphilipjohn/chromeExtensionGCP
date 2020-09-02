console.log("hello from background")

var globalurl ;
var host = "https://clientlogin.herokuapp.com";
var myNewUrl = "https://controllerlistener.uc.r.appspot.com/"
var noOfTimes = 1;


getDeviceInfo();

function openTheWindow(){
  window.open("./popup/popup.html", "extension_popup", "width=250,height=250,status=no,scrollbars=yes,resizable=no,top=230,left=470");
}


chrome.extension.onRequest.addListener(
  function(request,sender,sendResponse){
    if(request.event == "copy"){
      console.log("Copy Detected: "+(noOfTimes++)+"times");
    }
    sendResponse({});
  }
)

chrome.extension.onRequest.addListener(
  function(request,sender,sendResponse){
    if(request.event == "printBefore"){
      console.log("Printing request caught")
    }
    if(request.event == "printAfter"){
      console.log("printing request caught")
    }
  }
)



chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        console.log("hello from here:")
        globalurl = window.location.href;
        openTheWindow();
        return {cancel: true};
    },
    {
        urls: [
            "*://github.com/*"
        ],
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    },
    ["blocking"]
);

target = "^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?tiktok*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$"
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tabs) {
        var tab = tabs[0];
        var url = tab.url;
        console.log("URL: "+url)
        if(url.match(target)){
          
          globalurl = window.location.href;
          // openTheWindow();
          chrome.tabs.update(tab.id,{url: myNewUrl})
        }
      });
})

