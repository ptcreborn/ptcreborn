
// first create functions

var Register = {
    checkIfEmailExists: function (email) {
        // check from Pantry the email address
        let exists = false;
        if (Register.validateEmail(email))
            Register.getPantryData('https://getpantry.cloud/apiv1/pantry/8c1037f6-bf4b-443d-9941-a9f9c6a99671/basket/users', function (data) {
                data = JSON.parse(data);
                let keys = Object.keys(data);
                for (i = 0; i < keys.length; i++) {
                    if (data[keys[i]] == email) {
						Register.getBlobRecord('https://jsonblob.com/api/jsonBlob/' + data[keys[i]].blob_id, function(data) {
							if(data == '404')
								exists = false;
							else 
								exists = true;
						});
                        break;
                    }
                }
            });		
        return exists;
    },

    createAccount: function (email, blobData) {
        // check first if the email exists
        if (!Register.checkIfEmailExists(email)) {
            /* blobData Structure = {
                "nickname": "value",
                "joined": "value",
                "prof_image": "value",
                "background_image": "value",
                "about_me": "value"
            };*/

            Register.createRecordBlob(blobData, function (data) {
                // data is the id of the blob created.
                // then create a pantryData
                let pantryData = {
                    [email]: {
                        "blob_id": [data]
                    }
                }
                Register.createPantryData(pantryData, 'https://getpantry.cloud/apiv1/pantry/8c1037f6-bf4b-443d-9941-a9f9c6a99671/basket/users', function (data) {
                    // after creating direct to login page.

                });
            });
        } else
            window.alert('Your email address is existing! Try to login.');
    },

    getBlobRecord: function (url, callback) {
        let req = new XMLHttpRequest();

        req.onload = () => {
            if (req.readyState == 4)
                if (req.status == 200)
                    if (callback)
                        callback(req.response);
			    else if(req.status == 404)
					callback('404');
        }

        req.onerror = (err) => {
            window.alert('Error encountered! ' + err);
        }

        req.open('GET', url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send();
    },

    createRecordBlob: function (data, callback) {

        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open('POST', 'https://jsonblob.com/api/jsonBlob', false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/json');

        xhr.onload = function () {
            callback(xhr.getAllResponseHeaders().split('location: ')[1]);
        };

        xhr.send(data);
    },

    getPantryData: function (url, callback) {
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

        req.open('GET', url, false);
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

        req.open('PUT', url, false);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(data);
    },

    validateEmail: function (email) {
        return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }
}
