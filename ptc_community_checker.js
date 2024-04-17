
function ptcc_setCookie(e, t, l) {
    var o = new Date;
    o = new Date(o.getTime() + 1e3 * l),
    document.cookie = e + "=" + t + "; expires=" + o.toGMTString() + ";";
}

function ptcc_getCookieName(e) {
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

var ptcc_community_cookie_name = 'ptc_community_pantry';
var ptcc_post_cookie_name = 'ptc_post_blob';
var temp_blob_id = '';
var temp_pantry_data = '';

function checkIfCommunityCookieExists() {
    return (ptcc_getCookieName(ptcc_community_cookie_name));
}

function checkIfPostCookieExists() {
    return (ptcc_getCookieName(ptcc_post_cookie_name));
}

function getPantryCommunityData(callback) {
    let req = new XMLHttpRequest();

    req.onload = () => {
        if (req.readyState == 4)
            if (req.status == 200)
                if (callback)
                    callback(req.response);
    }

    req.onerror = (err) => {
        window.alert('Error encountered! ' + err);
    }

    req.open('GET', 'https://getpantry.cloud/apiv1/pantry/8c1037f6-bf4b-443d-9941-a9f9c6a99671/basket/posts', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send();
}

function processPantryCommunityData(data) {	
	temp_pantry_data = data;
}

function createRecordBlob(data, callback) {	
	
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('POST', 'https://jsonblob.com/api/jsonBlob', false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = function () {
        callback(xhr.getAllResponseHeaders());
    };

    xhr.send(data);
}

function successBlobRecord() {
	temp_blob_id = str.split('location: ')[1];
	ptcc_setCookie(ptcc_community_cookie_name, temp_blob_id, 120);
}
