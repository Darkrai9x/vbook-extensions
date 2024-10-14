load("language_list.js");

function execute(text, from, to, apiKey) {
    return translateContent(text, from, to, 0);
}

function translateContent(text, from, to, retryCount) {
    if (retryCount > 2) return null;
    if (!from) {
        from = detectLanguage(text);
    } else {
        from = languageMap[from];
    }
    let data = {
        query: text,
        from: from,
        to: languageMap[to],
        reference: "",
        corpusIds: [],
        qcSettings: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        domain: "common",
        milliTimestamp: Date.now()
    };
    let response = fetch("https://fanyi.baidu.com/ait/text/translate", {
        method: 'POST',
        headers: {
            'Referer': 'https://fanyi.baidu.com/',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        let result = response.text();
        let parts = result.split("\n");
        let trans = "";

        for (let part of parts) {
            if (part.startsWith("data")) {
                let obj = JSON.parse(part.substring(part.indexOf("{")));
                let tranData = obj.data;
                if (tranData.event === "Translating") {
                    let rData = tranData.list;
                    for (let item of rData) {
                        trans += item.dst + "\n";
                    }
                }
            }
        }
        return Response.success(trans.trim());
    }
    return translateContent(text, from, to, retryCount + 1);
}

function detectLanguage(text) {
    let sampleText = text.substring(0, Math.min(200, text.length));
    let response = fetch('https://fanyi.baidu.com/langdetect', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: {
            "query": sampleText
        },
    });
    if (response.ok) {
        return response.json().lan;
    }
    return "";
}