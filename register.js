  // first create functions

var Register = {
    checkIfEmailExists: function (email) {
        // check from Pantry the email address
        // exists code
        // 0 = means not existing
        // 1 = means existing
        // 2 = means invalid email address
        let exists = 0;
        if (Register.validateEmail(email).length > 0) {
            console.log('validated email.');
            Register.getPantryData('https://getpantry.cloud/apiv1/pantry/8c1037f6-bf4b-443d-9941-a9f9c6a99671/basket/users', function (data) {
                console.log('pantry data retrieved');
                data = JSON.parse(data);
                let keys = Object.keys(data);
                for (i = 0; i < keys.length; i++) {
                    if (keys[i] == email) {
                        console.log(data[keys[i]].blob_id);
                        Register.getBlobRecord('https://jsonblob.com/api/jsonBlob/' + data[keys[i]].blob_id, function (data) {
                            if (data == '404') {
                                exists = 0;
                              	console.log('email is not existing...');
                            }
                            else {
                                exists = 1;
                              	console.log('email is existing...');
                            }
                        });
                        i = keys.length;
                        break;
                    }
                }
            });
        } else
            exists = 2;
      	console.log('done function check email.');
        return exists;
    },

    createAccount: function (email, blobData, elem, succesRedirectUrl) {
        // check first if the email exists
        let emailExists = Register.checkIfEmailExists(email);
      	console.log('done checking emails');
        if (emailExists == 0) {
            /* blobData Structure = {
            "nickname": "value",
            "joined": "value",
            "prof_image": "value",
            "background_image": "value",
            "about_me": "value"
            };*/

            console.log('email not existing..');

            Register.createRecordBlob(blobData, function (data) {
                console.log('creating blob record');
                // data is the id of the blob created.
                // then create a pantryData
                let pantryData = JSON.stringify({
                    [email]: {
                        "i": data.split('jsonBlob/')[1]
                    }
                });
                Register.createPantryData(pantryData, 'https://getpantry.cloud/apiv1/pantry/8c1037f6-bf4b-443d-9941-a9f9c6a99671/basket/users', function (data) {
                    elem.innerText = 'Your account is successfully created!';
                    console.log('pantry record created.');
                    setTimeout(function () {
                        window.location.href = succesRedirectUrl;
                    }, 1000);
                });
            });
        } else if (emailExists == 1) {
            elem.innerText = 'The email address is already registered, try other email address.';
        } else if (emailExists == 2) {
            elem.innerText = 'You have input invalid email address.';
        }
    },

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

        req.open('GET', url, false);
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
            console.log(xhr.getAllResponseHeaders().split('location: ')[1]);
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
