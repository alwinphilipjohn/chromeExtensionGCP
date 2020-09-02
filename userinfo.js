
// chrome.system.network.getNetworkInterfaces(function (data) {
//   var networkName = data.name;
//   var deviceIP = data.address;
//   var prefixLength = data.prefixLength;
//   console.log("Network Name:- "+networkName+"\nIP address:- "+deviceIP+
//               "\nPrefix Length:- "+prefixLength)
// })
function getDeviceInfo(){
    var hostOs;
    var hostArch;
    var hostNativeArch;
    var latitude;
    var longitude;
    var appName;
    var ipOfUser;
    var result = null;

    chrome.runtime.getPlatformInfo(function (info){
        hostOs = info.os;
        hostArch = info.arch;
        hostNativeArch = info.nacl_arch;
        // console.log("OS:- "+hostOs+" Arch:- "+hostArch+"\n native Arch:- "+hostNativeArch)
      })

      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            // console.log("User Latitude: "+position.coords.latitude+"\nUser Longitude: "
            // +position.coords.longitude+" on browser "
            // +navigator.appName
            // +"\nURL:- "+url+"\nHost OS:- "+hostOs+"\nHost Arch:- "+hostArch);
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            appName = navigator.appName;
        })
    }
    else{
        console.log("Not supported")
    }
    
    getLocalIPs(function(ips) { // <!-- ips is an array of local IP addresses.
        // console.log('Local IP addresses:\n ' + ips.join('\n '));
        ipOfUser = ips.join('\n ');
      });
      
      function getLocalIPs(callback) {
        var ips = [];
      
        var RTCPeerConnection = window.RTCPeerConnection ||
            window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
      
        var pc = new RTCPeerConnection({
            // Don't specify any stun/turn servers, otherwise you will
            // also find your public IP addresses.
            iceServers: []
        });
        // Add a media line, this is needed to activate candidate gathering.
        pc.createDataChannel('');
        
        // onicecandidate is triggered whenever a candidate has been found.
        pc.onicecandidate = function(e) {
            if (!e.candidate) { // Candidate gathering completed.
                pc.close();
                callback(ips);
                return;
            }
            var ip = /^candidate:.+ (\S+) \d+ typ/.exec(e.candidate.candidate)[1];
            if (ips.indexOf(ip) == -1) // avoid duplicate entries (tcp/udp)
                ips.push(ip);
        };
        pc.createOffer(function(sdp) {
            pc.setLocalDescription(sdp);
        }, function onerror() {});
      }

      setTimeout(assignResult,1500)
      function assignResult(){
        result = {
            userOs: hostOs,
            userOsArch: hostArch,
            userOsNativeArch: hostNativeArch,
            userLatitude: latitude,
            userLongitude: longitude,
            userApp: appName,
            userIp: ipOfUser
        }
        if(result){
            console.log("User Details:- \n"+JSON.stringify(result))
            return result;
        }
        else{
            console.log("error:")
        }
  
      }



}
