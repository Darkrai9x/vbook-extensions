load('config.js');
// Direct .m3u8/.mp4 -> "native"; else pull it from the embed page; else "auto" sniffs the page.
// Bullet comments: add danmaku: [{ data: commentUrl, type: "" }] ("" = auto-detect format).
function findStream(embed) {
    let r = fetch(embed, { headers: { "User-Agent": UserAgent.chrome(), "Referer": BASE_URL } });
    if (!r.ok) return "";
    let m = r.text().match(/https?:(?:\\?\/){2}[^"'\s<>]+?\.(?:m3u8|mp4)(?:[?#][^"'\s<>]*)?(?=["'\s<>]|$)/i);
    return m ? m[0].replace(/\\/g, "") : "";
}

function execute(data) {
    let direct = /\.(?:m3u8|mp4)(?:[?#]|$)/i.test(data);
    let stream = direct ? data : findStream(data);
    if (stream) {
        return Response.success({
            type: "native",
            data: stream,
            host: BASE_URL,
            headers: { "User-Agent": UserAgent.chrome(), "Referer": direct ? BASE_URL : data }
        });
    }

    // No own Referer here: auto sends the page URL, and headers would override it.
    return Response.success({ type: "auto", data: data });

    // Player only works inside its own page (tokenized media): embed it, skipping the headless try.
    // return Response.success({ type: "webview", data: JSON.stringify({ data: data, embed: data }), host: BASE_URL });
}
