var Pantry = {
  getPantryData: function (url, callback) {
        let req = new XMLHttpRequest();

        req.onload = () => {
            if (req.readyState == 4)
                if (req.status == 200)
                    return callback(req.response);
        }

        req.onerror = (err) => {
            window.alert('Error encountered! ' + err);
        }

        req.open('GET', url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send();
    },

    createPantryData: function (data, url, callback) {
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

        req.open('PUT', url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(data);
    }
}
