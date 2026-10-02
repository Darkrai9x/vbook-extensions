load('config.js');
// track.js (video: step 2 of chap->track) — resolve one server's `data` (from
// chap.js) to a playable stream. `data` may be an embed URL or an already-direct
// .m3u8/.mp4. Prefer a native direct stream; when it can't be resolved
// (obfuscated/DRM/token) fall back to "auto" (webview only if auto fails too).
// Same contract for type "audio" — audio is parsed but has no player yet.
function resolveEmbedToStream(embed) {
    let r = fetch(embed, { headers: { "User-Agent": UserAgent.chrome(), "Referer": BASE_URL } });
    if (!r.ok) return "";
    let text = r.text();
    let m = text.match(/https?[:\\\/]+[^"'\s\\]+\.m3u8[^"'\s\\]*/i);
    if (m) return m[0].replace(/\\/g, "");
    m = text.match(/https?[:\\\/]+[^"'\s\\]+\.mp4[^"'\s\\]*/i);
    if (m) return m[0].replace(/\\/g, "");
    return "";
}

function execute(data) {
    // already a direct stream
    if (data.indexOf(".m3u8") !== -1 || data.indexOf(".mp4") !== -1) {
        return Response.success({
            type: "native",
            data: data,
            host: BASE_URL,
            mimeType: "application/x-mpegURL",
            headers: { "User-Agent": UserAgent.chrome(), "Referer": BASE_URL },
            timeSkip: []
        });
    }

    // try to pull the direct stream out of the embed page
    let stream = resolveEmbedToStream(data);
    if (stream) {
        return Response.success({
            type: "native",
            data: stream,
            host: BASE_URL,
            mimeType: "application/x-mpegURL",
            headers: { "User-Agent": UserAgent.chrome(), "Referer": data },
            timeSkip: []
        });
    }

    // couldn't extract the direct stream — let the app sniff it ("auto").
    // Switch to "webview" only if "auto" can't play this embed.
    return Response.success({
        type: "auto",
        data: data,
        host: BASE_URL,
        headers: { "User-Agent": UserAgent.chrome(), "Referer": BASE_URL },
        timeSkip: []
    });
}
