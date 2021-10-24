load("crypto.js");

function execute(url) {

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

    var htm = Http.get(url).string();

    var regex = /htmlContent\s*=\s*(".*?");/g;
    var htmlContent = JSON.parse(regex.exec(htm)[1]);
    var chapterHTML = CryptoJSAesDecrypt('3Dn5rc9' + 'gNa8fuX' + 'hT3k3S6', htmlContent);

    chapterHTML = chapterHTML.replace(/3Dn5rc9/g, '.');
    chapterHTML = chapterHTML.replace(/gNa8fuX/g, ':');
    chapterHTML = chapterHTML.replace(/hT3k3S6/g, '/');

    var doc = Html.parse(chapterHTML);
    var el = doc.select("img");

    var data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push(e.attr("data-3dn5rc9"));

    }
    return Response.success(data);
}