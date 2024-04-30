/*
"nickname": "ptcrebornofficial",
"joined": 1713859856574,
"password": "qwerty",
"prof_image": "https://i.ibb.co/LPkSfWK/Screenshot-2024-04-17-153021.png",
"background_image": "https://www.tynker.com/projects/screenshot/6174aa283a55c173090e03c2/battle-cats.png",
"about_me": "Im a newbie member."
 */

var EditProfile = {
    nickname: '',
    joined: '',
    password: '',
    prof_image: '',
    background_image: '',
    about_me: '',

    getAllFields: function (value) {
        // value is a JSON data.
        EditProfile.nickname = value.nickname;
        EditProfile.joined = value.joined;
        EditProfile.password = value.password;
        EditProfile.prof_image = value.prof_image;
        EditProfile.background_image = value.background_image;
        EditProfile.about_me = value.about_me;
    },

    updateRecordBlob: function (data, id, callback) {

        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open('PUT', 'https://jsonblob.com/api/jsonBlob/' + id, false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/json');

        xhr.onload = function () {
			if (xhr.readyState == 4)
                if (xhr.status == 200)
					callback(xhr.response);
        };

        xhr.send(JSON.stringify(data));
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

    edit: function (value, id, callback) {
        this.getAllFields(value);

        let data = {
            "nickname": this.nickname,
            "joined": this.joined,
            "password": this.password,
            "prof_image": this.prof_image,
            "background_image": this.background_image,
            "about_me": this.about_me
        };

        this.updateRecordBlob(data, id, callback);
    }
}
