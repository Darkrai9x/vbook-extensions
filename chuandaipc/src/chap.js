load("config.js");
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let part = loadChapterPart(url + "/");
    let content = part.content;
    while (part.next) {
        part = loadChapterPart(part.next);
        content += part.content;
    }

    return Response.success(content);
}

function loadChapterPart(url) {
    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        let htm = doc.select("#content").html();
        htm = htm.replace(/\&nbsp;/g, "");
        let nextUrl = doc.select("#next_url").attr("href");
        if (nextUrl) {
            nextUrl = nextUrl.replace(BASE_URL, "");
            if (/^.*?_\d+\/$/.test(nextUrl)) {
                nextUrl = BASE_URL + nextUrl;
            } else {
                nextUrl = ""
            }
        }
        return {
            "next": nextUrl,
            "content": htm
        };
    }
    return null;
}