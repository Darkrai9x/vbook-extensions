load('config.js');
// The audio player reads only data, headers, audios[0] and lyrics: `data` must be a direct media URL.
function findLyrics(text) {
    let m = text.match(/https?:(?:\\?\/){2}[^"'\s<>]+?\.lrc(?:[?#][^"'\s<>]*)?(?=["'\s<>]|$)/i);
    if (m) {
        let r = fetch(m[0].replace(/\\/g, ""));
        if (r.ok) return [{ data: r.text(), type: "lrc" }];
    }
    let lyric = Html.parse(text).select("SELECTOR_LYRICS_NODE").html()
        .replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").trim();
    return lyric ? [{ data: lyric, type: "txt" }] : [];   // [] when the site has none
}

function execute(data) {
    let headers = { "User-Agent": UserAgent.chrome(), "Referer": BASE_URL };
    if (/\.(?:mp3|m4a|aac|flac|ogg|opus|m3u8)(?:[?#]|$)/i.test(data)) {
        return Response.success({ type: "native", data: data, headers: headers });
    }

    let response = fetch(data, { headers: headers });
    if (!response.ok) return Response.error("HTTP " + response.status);
    let text = response.text();
    // Escaped JSON URLs (https:\/\/...) included; backslashes stripped below.
    let m = text.match(/https?:(?:\\?\/){2}[^"'\s<>]+?\.(?:mp3|m4a|aac|flac|ogg|opus|m3u8)(?:[?#][^"'\s<>]*)?(?=["'\s<>]|$)/i);
    if (!m) return Response.error("Không lấy được link audio");

    return Response.success({
        type: "native",
        data: m[0].replace(/\\/g, ""),
        headers: headers,
        lyrics: findLyrics(text)
    });
}
