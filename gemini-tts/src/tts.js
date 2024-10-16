load("voice_list.js");

function execute(text, voice) {
    let voiceInfo = voices.find(function (e) {
        return e.id == voice;
    });
    let lang = "vi";
    if (voiceInfo) {
        lang = voiceInfo.language;
    }
    let SNlM0e = localStorage.getItem("SNlM0e");
    if (!SNlM0e) {
        SNlM0e = extractSNlM0e();
        localStorage.setItem("SNlM0e", SNlM0e);
    }
    let response = fetch("https://gemini.google.com/_/BardChatUi/data/batchexecute", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": "",
        },
        queries: {
            "rpcids": "XqA3Ic",
            "bl": generateBardWebServer(),
            "hl": lang,
            "_reqid": generateReqID(),
            "rt": "c"
        },
        body: "f.req=" + encodeURIComponent(getPayloadData(text, lang)) + "&at=" + SNlM0e
    });
    if (response.ok) {
        let data = /(\[\["wrb.fr".*?"generic"]])/.exec(response.text())[1].trim();
        const jsonArray = JSON.parse(data);
        const contentArray = JSON.parse(jsonArray[0][2]);

        // Return base64
        return Response.success(contentArray[0]);
    }
    return null;
}

function generateBardWebServer() {
    return "boq_assistant-bard-web-server_20241014.09_p1"
}

function generateReqID() {
    return 100000 + parseInt(Array.from({length: 4}, () => Math.floor(Math.random() * 10)).join(''), 10);
}

function extractSNlM0e() {
    let response = fetch("https://gemini.google.com");
    if (response.ok) {
        let SNlM0e = /SNlM0e":"(.*?)"/.exec(response.text());
        if (SNlM0e) return SNlM0e
    }
    return null;
}


function getPayloadData(text, lang) {
    const data = [];
    data.push("XqA3Ic");

    const content = [];
    content.push(null);
    content.push(text);
    content.push(lang);
    content.push(null);
    content.push(2);

    data.push(JSON.stringify(content));
    data.push(null);
    data.push("generic");

    return JSON.stringify([[data]]);
}