textAreaAdjust(query('comment-value'));

function textAreaAdjust(element) {
    element.style.height = 'auto';
    element.style.height = (element.scrollHeight) + "px";
}

function disable(elem, disable) {
    if (disable) {
        elem.style.pointerEvents = 'none';
        elem.style.opacity = '0.5';
    } else {
        elem.style.pointerEvents = 'auto';
        elem.style.opacity = '1';
    }
}

function query(id) {
    return document.getElementById(id);
}

// build url
let url = window.location.href;
let record_api = 'https://jsonblob.com/api/jsonBlob/1242732119490158592';
url = url.split('.html')[0] + '.html';
let replied_to = '';
let username = 'Guest';
let userid = 'https://storehaccounts.blogspot.com/p/create-account.html'; 
let userimg = 'https://i.giphy.com/j5i2tzUmDA2OFeMJVL.webp';

// check the blob if exists!

function getAllAttachImages() {
    let attachimgs = query('comm_form_attached_images').querySelectorAll('img');
    let imgs = ' ';

    for (i = 0; i < attachimgs.length; i++) {
        let img = document.createElement('img');
        img.src = attachimgs[i].src;
        img.setAttribute('onclick', "window.open(\"" + img.src + "\", ' _blank ').focus();");
        img.style.cursor = 'pointer';
        imgs += img.outerHTML;
    }
    return imgs;
}

function createComment() {
    disable(query('form-ptc-comment'), true);
    let isReply = replied_to.length > 0;

    if (isReply)
        record_api = 'https://jsonblob.com/api/jsonBlob/' + replied_to;

    JBLOBFunctions.PUTRecordBlob(record_api, function (data) {
        let comment_value = query('comment-value').value;
        let comment_data;
        let blob_id = '';

        if (isReply)
            comment_data = {
                "username": username,
                "userimg": userimg,
                "content": comment_value,
              	"userid": userid,
                "imgs": getAllAttachImages(),
                "date": new Date().getTime()
            };
        else
            comment_data = {
                "username": username,
                "userimg": userimg,
              	"userid": userid,
                "content": comment_value,
                "imgs": getAllAttachImages(),
                "date": new Date().getTime(),
                "replies": []
            };

        JBLOBFunctions.createRecordBlob(JSON.stringify(comment_data), function (data) {
            blob_id = data.split('jsonBlob/')[1].replace('\r', '').replace('\n', '');
        });

        if (isReply)
            data.replies.push(blob_id);
        else {
            if (data.hasOwnProperty(url))
                data[url].comments.push(blob_id);
            else
                data[url] = {
                    "comments": [blob_id]
                };
        }

        return data;
    }, function (data) {
        window.location.reload();
    });
}

window.addEventListener('load', function () {
    getUserInfos();
    buildComment();
    disable(query('form-ptc-comment'), false);
}, false);

comm_imgupload1.addEventListener("change", ev => {
    query('post_btn').style.pointerEvents = 'none';
    query('post_btn').innerText = 'Please wait uploading image...';
    const formdata = new FormData();
    formdata.append("image", ev.target.files[0])
    fetch("https://api.imgbb.com/1/upload?key=07f1351d4e674784012d92ae6e03b49d", {
        method: "post",
        body: formdata
    }).then(data => data.json()).then(data => {
        let url = data.data.image.url;
        let img = document.createElement('img');
        img.src = url;
        img.style.maxWidth = "150px";
        img.style.margin = '5px';
        query('comm_form_attached_images').appendChild(img);
        query('post_btn').style.pointerEvents = 'auto';
        query('post_btn').innerText = 'Comment';
    }).catch((data) => {
        window.alert("Error in uploading! Try uploading again.");
        query('post_btn').style.pointerEvents = 'auto';
        query('post_btn').innerText = 'Comment';
    });
});

function addElementToNext(thisElement, newElement, id) {
    replied_to = id + '';
    thisElement.parentNode.insertBefore(newElement, thisElement.nextSibling);
  	query('add-comment-btn').style.display = 'block';
}

function resetCommentForm(elem) {
    addElementToNext(elem, query('form-ptc-comment'), '');
  	query('add-comment-btn').style.display = 'none';
}

// build comments
function buildComment() {
    JBLOBFunctions.getBlobRecord(record_api, async function (data) {
        data = JSON.parse(data);
        let totalLength = data[url].comments.length;
        if (data.hasOwnProperty(url)) {
            for (i = 0; i < totalLength; i++) {
                let comment_id = data[url].comments[i];
                let temp_data;
                await JBLOBFunctions.getBlobRecordSync('https://jsonblob.com/api/jsonBlob/' + comment_id, async function (data) {
                    temp_data = JSON.parse(data);
                });

                let username = temp_data.username;
                let userimg = temp_data.userimg;
              	let userid = temp_data.userid;
                let content = temp_data.content.replaceAll('\n', '<br/>');
                let date = moment(parseInt(temp_data.date)).fromNow();
                let reply_build = '';
                let num_of_replies = (temp_data.replies.length > 0 ? " - about " + temp_data.replies.length + " replies" : "");

                let div_imgs = document.createElement('div');
                div_imgs.setAttribute('class', 'image-attachments');
                div_imgs.innerHTML = temp_data.imgs;

                for (j = 0; j < temp_data.replies.length; j++) {
                    let reply_comment_id = temp_data.replies[j];
                    await JBLOBFunctions.getBlobRecordSync('https://jsonblob.com/api/jsonBlob/' + reply_comment_id, function (data) {
                        data = JSON.parse(data);

                        let div_imgs = document.createElement('div');
                        div_imgs.setAttribute('class', 'image-attachments');
                        div_imgs.innerHTML = data.imgs;

                        reply_build += "<div id=" + reply_comment_id + " class='comment-replied'><img class='user-profile' src='" + data.userimg + "'/><a target='_blank' href='"+ data.userid + "'>" + data.username + "</a><span>replied " + moment(parseInt(data.date)).fromNow() + "</span><p>" + data.content.replaceAll('\n', '<br/>') + "</p>" + div_imgs.outerHTML + "</div>";
                    });
                }

                query('comment-container').innerHTML += "<div id=" + comment_id + " class='comment-thread'><img class='user-profile' src='" + userimg + "'/><a target='_blank' href='" + userid + "'>" + username + "</a><span>commented " + date + " " + num_of_replies + "</span><p>" + content + "</p>" + div_imgs.outerHTML + "" + reply_build + "<div style='position: relative; width: 100%;margin: 10px 0 50px 0;'><button style='font-size: 12px !important; color: black !important;' onclick='addElementToNext(this, query(\"form-ptc-comment\"), \"" + comment_id + "\")'>Add reply</button></div></div>";
            }
        }
    });
}

async function getUserInfos() {
    // check if user is logged in
    let user = localStorage.getItem('ptc_user');

    if (user) {
        // means logged in.              
        let temp_data;
      	user = JSON.parse(user);
      
        await JBLOBFunctions.getBlobRecordSync('https://jsonblob.com/api/jsonBlob/' + user.user, function (data) {
            temp_data = JSON.parse(data);
        });

        username = temp_data.nickname;
        userimg = temp_data.prof_image;
      	userid = 'https://storehaccounts.blogspot.com/p/your-account-page.html?' + user.user;
		
		query('current-user').innerText = username;
    }
}
