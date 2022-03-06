load("crypto.js");

function execute(url) {
    let chapId = /-(\d+).html/.exec(url)[1];

    let data = fetchData("https://webapi.gongzicp.com/novel/chapterGetInfo?cid=" + chapId + "&server=0", 5);

    if (data) {
        let iv = CryptoJS.enc.Utf8.parse("$h$b3!" + "iGzsYn" + parseInt("165455", 14).toString(32));
        let key = CryptoJS.enc.Utf8.parse("u0LRrbu$En" + parseInt("4d5a6c8", 14).toString(36) + "A");
        let byte = CryptoJS.AES.decrypt(data, key, {
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
            iv: iv,
        });
        return Response.success(CryptoJS.enc.Utf8.stringify(byte).toString().replace(/\r\n/g, "<br>"));
    }
    return null;
}

function fetchData(url, retryLimit) {
    let response = fetch(url);

    if (response.ok) {
        let data = response.json();
        if (data.code === 200) {
            let chapterInfo = data.data.chapterInfo;
            let content = chapterInfo.content;
            if (chapterInfo.chapterPrice !== 0 || content.length === 0) return null;
            if (content.length < 30) {
                if (retryLimit > 1) {
                    sleep(Math.random() * 1000 + 2000)
                    return fetchData(url, retryLimit - 1);
                }
            } else {
                return content;
            }

        }
    }
    return null;
}
