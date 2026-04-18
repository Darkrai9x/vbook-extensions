load("voice_list.js");

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36";
let _googleIdx = 0;
function execute(text, voice) {
    let voiceInfo = voices.find(function (e) {
        return e.id == voice;
    });
    let lang = "vi";
    if (voiceInfo) {
        lang = voiceInfo.language;
    }
    let token = getGoogleToken();
    let cleanText = text
        .replace(/[@^*()\\/\-_+=><"'\u201c\u201d\u3010\u3011]/g, " ")
        .replace(/, /g, ". ");

    let rpcId = "jQ1olc";
    let reqId = (++_googleIdx * 100000) + Math.floor(1000 + Math.random() * 9000);
    let query =
        "rpcids=" + encodeURIComponent(rpcId) +
        "&source-path=%2F" +
        "&f.sid=" + encodeURIComponent(token["f.sid"]) +
        "&bl=" + encodeURIComponent(token.bl) +
        "&hl=" + encodeURIComponent(lang) +
        "&soc-app=1&soc-platform=1&soc-device=1" +
        "&_reqid=" + reqId +
        "&rt=c";
    let payload = [cleanText, lang, null, null, [0]];
    let fReq = JSON.stringify([[[rpcId, JSON.stringify(payload), null, "generic"]]]);

    var body = "f.req=" + encodeURIComponent(fReq) + "&at=" + encodeURIComponent(token.at);
    let response = fetch("https://translate.google.com/_/TranslateWebserverUi/data/batchexecute?" + query, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Referer": "https://translate.google.com/",
            "User-Agent": UA
        },
        body: body
    });
    if (response.ok) {
        let data = response.text();
        const split = JSON.parse(data.split("\n")[3]);
        const base64 = JSON.parse(split[0][2])[0];
        if (!base64 || base64.length < 100) return Response.error("Google TTS returned empty audio");

        // Return base64
        return Response.success(base64);
    }
    return null;
}

const GOOGLE_REFRESH = 11 * 60 * 1000;
function getGoogleToken() {
    var now = new Date().getTime();

    let cacheToken = JSON.parse(cacheStorage.getItem("google_token") || null);

    if (
        cacheToken && cacheToken.token &&
        now - cacheToken.tokenTime < GOOGLE_REFRESH
    ) {
        return cacheToken.token;
    }

    var res = fetch("https://translate.google.com/", {
        headers: { "User-Agent": UA }
    });

    if (!res.ok) {
        throw "Google translate fetch failed: " + res.status;
    }

    var html = res.text(); // sync

    var fSidMatch = html.match(/"FdrFJe":"(.*?)"/);
    var blMatch = html.match(/"cfb2h":"(.*?)"/);
    var atMatch = html.match(/"SNlM0e":"(.*?)"/);

    var fSid = fSidMatch ? fSidMatch[1] : null;
    var bl = blMatch ? blMatch[1] : null;
    var at = atMatch ? atMatch[1] : null;

    if (!fSid || !bl || !at) {
        throw "Failed to parse Google token";
    }
    let newCacheToken = {};
    newCacheToken.token = {
        "f.sid": fSid,
        bl: bl,
        at: at
    };
    newCacheToken.tokenTime = now;
    cacheStorage.setItem("google_token", JSON.stringify(newCacheToken));

    return newCacheToken.token;
}