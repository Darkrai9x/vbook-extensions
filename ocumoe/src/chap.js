load('config.js');
load('crypto.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url);
    if (response.ok) {
        let htm = response.text();

        var regex = /htmlContent\s*=\s*(".*?");/g;
        var htmlContent = JSON.parse(regex.exec(htm)[1]);
        var chapterHTML = CryptoJSAesDecrypt('M6m2Ej7' + 'Cmn3WHQ' + 'srQk3sr', htmlContent);

        chapterHTML = chapterHTML.replace(/M6m2Ej7/g, '.');
        chapterHTML = chapterHTML.replace(/Cmn3WHQ/g, ':');
        chapterHTML = chapterHTML.replace(/srQk3sr/g, '/');

        var doc = Html.parse(chapterHTML);
        var el = doc.select("img");

        var data = [];
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            data.push(e.attr("data-m6m2ej7"));

        }
        return Response.success(data);
    }
    return null;
}

function CryptoJSAesDecrypt(passphrase, encrypted_json_string) {
    var obj_json = JSON.parse(encrypted_json_string);
    var encrypted = obj_json.ciphertext;
    var salt = CryptoJS.enc.Hex.parse(obj_json.salt);
    var iv = CryptoJS.enc.Hex.parse(obj_json.iv);
    var key = CryptoJS.PBKDF2(passphrase, salt, {
        hasher: CryptoJS.algo.SHA512,
        keySize: 64 / 8,
        iterations: 999
    });
    var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}
