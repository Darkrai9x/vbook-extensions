function execute(text, voice) {

    let voicePart = voice.split(";");
    let voiceName = voicePart[0];
    let voiceGender = voicePart[1];
    let voiceLangPart = voicePart[0].split("-");
    let voiceLang = voiceLangPart[0] + "-" + voiceLangPart[1];
    let tokenData = findBingData();
    let response = fetch("https://www.bing.com/tfettts?isVertical=1&&IG=" + tokenData.IG + "&IID=" + tokenData.IID, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: {
            "ssml": generateSSML(text, voiceLang, voiceName, voiceGender),
            "token": tokenData.token,
            "key": tokenData.key + ""
        }
    });
    if (response.ok) {
        return Response.success(response.base64());
    }
    return null;
}

function findBingData() {
    let html = fetch("https://www.bing.com/translator").text();
    let token = /var params_AbusePreventionHelper\s?=\s?(\[.*?]);/.exec(html)[1];
    let jsonToken = JSON.parse(token);
    return {
        "IG": /IG:"([A-Z0-9]+)"/.exec(html)[1],
        "IID": /data-iid="(translator.\d+)"/.exec(html)[1],
        "token": jsonToken[1],
        "key": jsonToken[0],
        "tokenExpiryInterval": jsonToken[3],
    };
}

function generateSSML(text, voiceLang, voiceName, voiceGender) {
    return "<speak version='1.0' xml:lang='" + voiceLang + "'><voice xml:lang='" + voiceLang + "' xml:gender='" + voiceGender + "' name='" + voiceName + "'><prosody rate='-20.00%'>" + escapeXml(text) + "</prosody></voice></speak>"
}

function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '&':
                return '&amp;';
            case '\'':
                return '&apos;';
            case '"':
                return '&quot;';
        }
    });
}