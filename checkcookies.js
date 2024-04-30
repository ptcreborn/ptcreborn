
var PTC_Cookies = {

    checkIfCookiesSupported: function () {
        return navigator.cookieEnabled;
    },

    retrieveCookies: function (path) {
        if (PTC_Cookies.getCookieName(path))
            return JSON.parse(PTC_Cookies.getCookieName(path));
        else
            return null;
    },
	
	deleteCookies: function(path) {
		PTC_Cookies.setCookie(path, '', 1);
	}

    storeCookies: function (path, jsonStr, timeInSec) {
        PTC_Cookies.setCookie(path, jsonStr, timeInSec);
    },

    setCookie: function (e, t, l) {
        var o = new Date;
        o = new Date(o.getTime() + 1e3 * l),
        document.cookie = e + "=" + t + "; expires=" + o.toGMTString() + ";";
    },

    getCookieName: function (name) {
        function escape(s) {
            return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1');
        }
        var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
        return match ? match[1] : null;
    }
}
