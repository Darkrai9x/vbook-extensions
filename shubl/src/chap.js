load('crypto.js');
load('base64.js');

function execute(url) {

    url = url.replace("m.shubl.com", "shubl.com");
    let chapterId = /book_chapter_detail\/(\d+)\/?/.exec(url)[1];

    let accessKey = getChapterAccessKey(chapterId);

    let response = fetch("https://shubl.com/chapter/get_book_chapter_detail_info", {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': url
        },
        body: {
            'chapter_id': chapterId,
            'chapter_access_key': accessKey,
        }
    });
    if (response.ok) {
        let json = response.json();
        if (json.code === 100000) {
            return Response.success(decrypt(json.chapter_content, json.encryt_keys, accessKey));
        } else {
            let response = fetch("https://shubl.com/chapter/ajax_get_image_session_code", {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Referer': url
                }
            });
            if (response.ok) {
                let json = response.json();
                let imageCode = decrypt(json.image_code, json.encryt_keys, json.access_key);
                return Response.success('<img src=\'' + 'https://shubl.com/chapter/book_chapter_image?chapter_id=' + chapterId + '&area_width=761.188&font=undefined&font_size=40&image_code=' + imageCode + '&bg_color_name=white&text_color_name=white' + '\' />');
            }
        }
    }

    return null;
}

function getChapterAccessKey(chapterId) {
    let response = fetch("https://shubl.com/chapter/ajax_get_session_code", {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: {
            'chapter_id': chapterId
        }
    });
    if (response.ok) {
        return response.json().chapter_access_key;
    }

    return '';
}

function decrypt(content, keys, accessKey) {
    var t = keys.length;
    var o = accessKey.split("");
    var m = o.length;
    var k = new Array();
    k.push(keys[(o[m - 1].charCodeAt(0)) % t]);
    k.push(keys[(o[0].charCodeAt(0)) % t]);
    for (i = 0; i < k.length; i++) {
        content = Base64.decode(content);
        var p = k[i];
        var j = Base64.encode(content.substr(0, 16));
        var f = Base64.encode(content.substr(16));
        var h = CryptoJS.format.OpenSSL.parse(f);
        content = CryptoJS.AES.decrypt(h, CryptoJS.enc.Base64.parse(p), {
            iv: CryptoJS.enc.Base64.parse(j),
            format: CryptoJS.format.OpenSSL
        });
        if (i < k.length - 1) {
            content = content.toString(CryptoJS.enc.Base64);
            content = Base64.decode(content);
        }
    }
    return content.toString(CryptoJS.enc.Utf8);
}