(function () {
    // This function check if browser is IE8 or older.
    // Next browser checking will be at "browser-detect.js" file
    if (window.attachEvent && !document.addEventListener) { //check for IE8 and older
        var browserNotSupportedElem = document.createElement("div");
        browserNotSupportedElem.setAttribute("id", "browser-not-supported");
        browserNotSupportedElem.innerHTML = "К сожалению, работа сервиса " + window.location.hostname + " не поддерживается из данного браузера.<br>Для работы с сервисом используйте соответствующие браузеры:<br>" +
            "Windows OS и Android: Chrome v51+, Yandex Browser;<br>" +
            "iOS: Safari, Chrome v51+, Yandex Browser for iPad;<br>" +
            "macOS: Safari, Chrome v51+, Yandex Browser.";
        document.body.insertBefore(browserNotSupportedElem, null);
        document.execCommand("Stop", false);
    }
})();
