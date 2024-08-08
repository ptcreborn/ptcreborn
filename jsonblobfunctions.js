var JBLOBFunctions = {

    getBlobRecord: function (url, callback) {
        let req = new XMLHttpRequest();

        req.onload = () => {
            if (req.readyState == 4)
                if (req.status == 200)
                    if (callback)
                        callback(req.response);
                    else if (req.status == 404) {
                        if (callback)
                            callback('404');
                    } else {
                        if (callback)
                            callback('undefined');
                    }
        }

        req.onerror = (err) => {
            window.alert(req.statusText);
        }

        req.open('GET', url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        try {
            req.send();
        } catch (err) {
            console.log('error: ' + err);
        }
    },

    getBlobRecordSync: function (url, callback) {
        return new Promise(function (resolve, reject) {
            let req = new XMLHttpRequest();

            req.onload = () => {
                if (req.readyState == 4)
                    if (req.status == 200) {
                        if (callback)
                            callback(req.response);
                        resolve(req.response);
                    } else {
                        if (callback)
                            callback('undefined');
                        reject('undefined');
                    }
            }

            req.onerror = (err) => {
                window.alert(req.statusText);
            }

            req.open('GET', url, true);
            req.setRequestHeader('Content-Type', 'application/json');
            try {
                req.send();
            } catch (err) {
                console.log('error: ' + err);
            }
        });
    },

    createRecordBlob: function (data, callback) {

        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open('POST', 'https://jsonblob.com/api/jsonBlob', false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/json');

        xhr.onload = function () {
            console.log(xhr.getAllResponseHeaders().split('location: ')[1]);
            callback(xhr.getAllResponseHeaders().split('location: ')[1].replace('\r', '').replace('\n', ''));
        };

        xhr.send(data);
    },

    updateRecordBlob: function (data, url, callback) {
        let req = new XMLHttpRequest();

        req.onload = () => {
            if (req.readyState == 4)
                if (req.status == 200)
                    if (callback)
                        callback(req.response);
                    else if (req.status == 404)
                        callback('404');
        }

        req.onerror = (err) => {
            window.alert(req.statusText);
        }

        req.open('PUT', url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(data));
    },

    PUTRecordBlob: function (url, process, callback) {
        JBLOBFunctions.getBlobRecord(url, function (data) {
            data = JSON.parse(data);
            new_data = process(data);
            JBLOBFunctions.updateRecordBlob(new_data, url, callback);
        });
    }
}
