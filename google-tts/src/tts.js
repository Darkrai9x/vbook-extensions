load("voice_list.js");

function execute(text, voice) {
    let voiceInfo = voices.find(function (e) {
        return e.id == voice;
    });
    let lang = "vi";
    if (voiceInfo) {
        lang = voiceInfo.language;
    }
    let response = fetch("https://translate.google.com/_/TranslateWebserverUi/data/batchexecute", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": "",
        },
        body: "f.req=" + encodeURIComponent(getPayloadData(text, lang))
    });
    if (response.ok) {
        let data = response.text().replace(/^\)\]\}'/, '').trim();
        const jsonArray = JSON.parse(data);
        const contentArray = JSON.parse(jsonArray[0][2]);

        // Return base64
        return Response.success(contentArray[0]);
    }
    return null;
}

function getPayloadData(text, lang) {
    const data = [];
    data.push("jQ1olc");

    const content = [];
    content.push(text);
    content.push(lang);
    content.push(null);
    content.push("null");

    data.push(JSON.stringify(content));
    data.push(null);
    data.push("generic");

    return JSON.stringify([[data]]);
}