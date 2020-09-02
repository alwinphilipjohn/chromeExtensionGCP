function onCopy(e){
    chrome.extension.sendRequest({event : "copy"})
}

document.addEventListener('copy',onCopy,true);


(function() {
    var beforePrint = function() {
        console.log('Functionality to run before printing.');
        chrome.extension.sendRequest({event : "printBefore"})
    };
    var afterPrint = function() {
        console.log('Functionality to run after printing');
        chrome.extension.sendRequest({event : "printAfter"})
    };

    if (window.matchMedia) {
        var mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(function(mql) {
            if (mql.matches) {
                beforePrint();
            } else {
                afterPrint();
            }
        });
    }

    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;
}());