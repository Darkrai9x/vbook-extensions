load("language_list.js");

function execute(text, from, to, apiKey) {
    return translateContent(text, from, to, 0);
}

function translateContent(text, from, to, retryCount) {
    if (retryCount > 2) return null;
    let lines = text.split("\n");
    let data = JSON.stringify(lines.map(line => ({"Text": line})));
    let queries;
    if (from) {
        queries = {
            "from": from,
            "to": to,
            "api-version": "3.0"
        }
    } else {
        queries = {
            "to": to,
            "api-version": "3.0"
        }
    };
    let response = fetch("https://api-edge.cognitive.microsofttranslator.com/translate", {
        method: "POST",
        queries: queries,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getAuthorizationToken(),
        },
        body: data
    });
    if (response.ok) {
        let result = response.text();
        if (result.startsWith("[")) {
            let trans = "";
            JSON.parse(result).forEach(item => {
                trans += item.translations[0].text + "\n";
            });
            return Response.success(trans.trim());
        }
    }
    localStorage.setItem("authorization", "");
    return translateContent(text, from, to, retryCount + 1);
}

function getAuthorizationToken() {
    let authorization = localStorage.getItem("authorization");
    if (authorization) return authorization
    let response = fetch("https://edge.microsoft.com/translate/auth", {
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0"
        }
    });

    if (response.ok) {
        authorization = response.text();
        localStorage.setItem("authorization", authorization);
        return authorization;
    }
    return null;
}