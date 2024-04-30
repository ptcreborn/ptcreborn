
var PTC_Cookies = {

    checkIfCookiesSupported: function () {
        return navigator.cookieEnabled;
    },

    retrieveCookies: function(path) {
        if (PTC_Cookies.getCookieName(path))
            return JSON.parse(PTC_Cookies.getCookieName(path));
        else 
			return null;		
    },
	
	storeCookies: function(path, jsonStr, timeInSec) {
		PTC_Cookies.setCookie(path, jsonStr, timeInSec);
	},

    setCookie: function (e, t, l) {
        var o = new Date;
        o = new Date(o.getTime() + 1e3 * l),
        document.cookie = e + "=" + t + "; expires=" + o.toGMTString() + ";";
    },

    getCookieName: function(e) {
        var t = document.cookie,
        l = e + "=",
        o = t.indexOf("; " + l);
        if (-1 == o) {
            if (0 != (o = t.indexOf(l)))
                return null
        } else {
            o += 2;
            var n = document.cookie.indexOf(";", o);
             - 1 == n && (n = t.length)
        }
        return decodeURI(t.substring(o + l.length, n))
    }
}
