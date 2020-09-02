
/*
    The javascript file for the popup html which is responsible for the
    communication btwn controller and client.
*/

window.onload = function() {

    var bgpage = chrome.extension.getBackgroundPage();
    var url = bgpage.url;
    var hostOs = bgpage.hostOs;
    var hostArch = bgpage.hostArch;
    var langitude;
    var longitude;
    var appname;
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            console.log("User Latitude: "+position.coords.latitude+"\nUser Longitude: "
            +position.coords.longitude+" on browser "
            +navigator.appName
            +"\nURL:- "+url+"\nHost OS:- "+hostOs+"\nHost Arch:- "+hostArch);
            langitude = position.coords.latitude;
            longitude = position.coords.longitude;
            appname = navigator.appName;
        })
    }
    else{
        console.log("Not supported")
    }
    var btn = document.getElementById("loginButton");

    if(btn){
        btn.addEventListener("click", function(e) {
            e.preventDefault();

            var uname = document.getElementById("name").value;
            var pwd = document.getElementById("pwd").value;
            console.log("User input Values\nUsername: "+uname+"\nPassword:- "+pwd);
            const req = new XMLHttpRequest();
            const baseUrl = "https://clientlogin.herokuapp.com/login";
            const urlParams = `uname=${uname}&password=${pwd}&lo=${langitude}&la=${longitude}&appname=${appname}`;
            req.open("POST", baseUrl, true);
            req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            req.send(urlParams);
            req.onreadystatechange = function() { // Call a function when the state changes.
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    console.log("Got response 200!");
                    console.log(this.response)
                    // window.close();
                }
                else if(this.status != 200){
                    document.getElementById("message").innerHTML="Authentication Failure";
                }
            }
        });
    }
    else{
        console.log("In  else")
    }


}