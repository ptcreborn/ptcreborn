// first create functions

var Login = {
	userBlob: "",
	
    checkIfEmailExists: function (email) {
        // check from Pantry the email address
        // return the blob_id
        // exists code
        // 0 = means not existing
        // 1 = means existing
        // 2 = means invalid email address
        let exists = [0, 'id'];
        if (Login.validateEmail(email).length > 0) {
            console.log('validated email.');
            Login.getPantryData('https://getpantry.cloud/apiv1/pantry/8c1037f6-bf4b-443d-9941-a9f9c6a99671/basket/users', function (data) {
                console.log('pantry data retrieved');
                data = JSON.parse(data);
                let keys = Object.keys(data);
                for (i = 0; i < keys.length; i++) {
                    if (keys[i] == email) {
                        let blob_id = data[keys[i]].i;
                        Login.getBlobRecord('https://jsonblob.com/api/jsonBlob/' + blob_id, function (data) {
							Login.userBlob = blob_id;
                            if (data == '404') {
                                exists[0] = 0;
                                console.log('email is not existing...');
                            } else {
                                exists[0] = 1;
                                exists[1] = blob_id;
                                console.log('email is existing...');
                            }
                        });
                        i = keys.length;
                        break;
                    }
                }
            });
        } else
            exists[0] = 2;
        console.log('done function check email.');
        return exists;
    },

    login: function (email, password, elem) {
        // check first if the email exists
        let emailExists = Login.checkIfEmailExists(email);
		let result = false;
        console.log('done checking emails');
        if (emailExists[0] == 1) {
            Login.getBlobRecord('https://jsonblob.com/api/jsonBlob/' + emailExists[1], function (data) {
                data = JSON.parse(data);
                if (password == data.password) {
                    elem.innerText = 'Login successfully!';
                    result = true;
                } else {
                    result = false;
                    elem.innerText = 'The password is not correct, please type again!';
                }
            });
        } else if (emailExists[0] == 0) {
            result = false;
            elem.innerText = 'The email address is not yet registered. Please create an account.';
        } else if (emailExists[0] == 2) {
            result = false;
            elem.innerText = 'You have input invalid email address.';
        }
		return result;
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
                    return callback(req.response);
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
