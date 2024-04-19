
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

function getBlobRecord(url, callback) {
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

    req.open('GET', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send();
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

    req.open('GET', 'https://getpantry.cloud/apiv1/pantry/8c1037f6-bf4b-443d-9941-a9f9c6a99671/basket/posts', false);
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

function loadCommunityContents(json_data) {
	// check whether the content exists
	// display the content or just display to console log
	
	let keys = Object.keys(json_data);
	
	for(i=0; i<keys.length; i++) {
		console.log(json_data[keys[i]].content);
		// Get the content of the blob_id
		
		getBlobRecord('https://jsonblob.com/api/jsonBlob/' + blob_cookie, function(data) {
			data = JSON.parse(data);
			console.log(data.profImg);
			console.log(data.username);
			console.log(data.blobId);
			console.log(data.content);
			console.log(data.attchImgs);
		});
	}	
}

// MAIN CORE ACCORDING TO FLOW

function loadCommunity() {
    if (checkIfCommunityCookieExists()) {
        // Means the cookies is stil available
        // Get the blob id from the cookie
        // Load them

        let blob_cookie = ptcc_getCookieName(ptcc_community_cookie_name);
        if (blob_cookie.includes(';'))
            blob_cookie = blob_cookie.split(';')[0];
		
		getBlobRecord('https://jsonblob.com/api/jsonBlob/' + blob_cookie, function(data) {
			
		});

    } else {
        // Replica the pantry community data
        // Save to Blob
        // Create cookie
        // Go back to loadCommunity function

        getPantryCommunityData(processPantryCommunityData);
        createRecordBlob(temp_pantry_data, successBlobRecord);
        loadCommunity();
    }
}

// Continue tomorrow get the ID of blob
