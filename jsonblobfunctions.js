var JBLOBFunctions = {

    getBlobRecord: function (url, callback) {
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
            window.alert('Error encountered! ' + err);
        }

        req.open('GET', url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send();
    },

    getBlobRecordSync: function (url, callback) {
        return new Promise(function (resolve, reject) {
            let req = new XMLHttpRequest();

            req.onload = () => {
                if (req.readyState == 4)
                    if (req.status == 200)
                        if (callback) {
							resolve("Success!");
                            callback(req.response);
						}
                        else if (req.status == 404)
                            callback('404');
            }

            req.onerror = (err) => {
                window.alert('Error encountered! ' + err);
            }

            req.open('GET', url, true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.send();
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
            callback(xhr.getAllResponseHeaders().split('location: ')[1]);
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
            window.alert('Error encountered! ' + err);
        }

        req.open('PUT', url, false);
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
