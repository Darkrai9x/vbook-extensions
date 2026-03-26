load("config.js");
load("base64.js");
load("crypto.js");


function decryptContent(content) {

    var cleaned = content.replace(/[^A-Za-z0-9+/=]/g, '');
    var keyStr = content.substring(17, 33); 
    while (cleaned.length % 4 !== 0) cleaned += '=';
    var innerStr = Base64.decode(cleaned);


    var valueMarker = '"value":"';
    var vStart = innerStr.indexOf(valueMarker);
    if (vStart === -1) throw new Error('Không tìm được field value');
    vStart += valueMarker.length;


    var vEnd = vStart;
    while (vEnd < innerStr.length && innerStr.charCodeAt(vEnd) !== 0x22) {
        vEnd++;
    }
    var valueB64 = innerStr.substring(vStart, vEnd).replace(/[^A-Za-z0-9+/=]/g, '');
    if (!valueB64) throw new Error('value field rỗng');


    var cipherWA = CryptoJS.enc.Base64.parse(valueB64);
    var cipherLen = cipherWA.sigBytes;
    if (cipherLen < 32) throw new Error('Ciphertext quá ngắn: ' + cipherLen);




    var keyWords = [0, 0, 0, 0];
    for (var k = 0; k < 16; k++) {
        keyWords[Math.floor(k / 4)] |= (keyStr.charCodeAt(k) & 0xff) << (24 - (k % 4) * 8);
    }
    var key = CryptoJS.lib.WordArray.create(keyWords, 16);


    var iv = CryptoJS.lib.WordArray.create(cipherWA.words.slice(0, 4), 16);


    var encLen = cipherLen - 16;
    var encWA = CryptoJS.lib.WordArray.create(cipherWA.words.slice(4), encLen);


    var decrypted = CryptoJS.AES.decrypt(
        CryptoJS.lib.CipherParams.create({ ciphertext: encWA }),
        key,
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );

    var latin1Str = CryptoJS.enc.Latin1.stringify(decrypted);
    var startIndex = 0;
    while (startIndex < latin1Str.length) {
        var code = latin1Str.charCodeAt(startIndex) & 0xff;
        if (code >= 0x80 && code <= 0xBF) {
            startIndex++;
        } else {
            break;
        }
    }

    var result = "";
    try {
        if (startIndex > 0) {
            var cleanLatin1 = latin1Str.substring(startIndex);
            var cleanWA = CryptoJS.enc.Latin1.parse(cleanLatin1);
            result = CryptoJS.enc.Utf8.stringify(cleanWA);
        } else {
            result = CryptoJS.enc.Utf8.stringify(decrypted);
        }
    } catch (err) {
        result = decodeURIComponent(escape(latin1Str.substring(startIndex)));
    }

    if (!result) throw new Error('Giải mã ra rỗng');
    return result;
}

function execute(url) {
    var authorization = getToken();
    if (!authorization) return Response.error(ERROR_MESSAGE);


    var chapId = url.match(/(\d+)$/);
    if (!chapId) return Response.error('Không tìm thấy chapter ID trong URL: ' + url);
    var chapterId = chapId[1];

    console.log("headers authorization: " + JSON.stringify(apiHeaders(authorization)))
    var chapRes = fetch(API_HOST + '/api/chapters/' + chapterId, {
        headers: apiHeaders(authorization)
    });
    if (!chapRes.ok) return Response.error(ERROR_MESSAGE);
    var chapData = chapRes.json().data;
    if (!chapData || !chapData.content) return Response.error(ERROR_MESSAGE);
    if (chapData.is_locked) return Response.error(ERROR_MESSAGE);


    var raw;
    try {
        raw = decryptContent(chapData.content);
    } catch (e) {
        return Response.error('Giải mã thất bại: ' + String(e));
    }


    var doubleNl = raw.indexOf('\n\n');
    var body = (doubleNl >= 0 && doubleNl < 150) ? raw.substring(doubleNl + 2) : raw;


    body = body.replace(/·/g, '').replace(/\n/g, '<br>');

    return Response.success(body);
}
