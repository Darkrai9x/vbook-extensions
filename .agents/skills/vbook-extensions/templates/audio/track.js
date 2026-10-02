load('config.js');
// track.js (audio: step 2 of chap->track) — resolve chap.js's `data` handle to a
// playable audio URL.
//
// The audio player reads the resolved track in this order:
//   audios[0].data + audios[0].headers   (preferred when present)
//   data          + headers              (fallback)
// so a plain { type, data, headers } is enough; `audios` exists for sites that
// expose several bitrates/qualities — put the one to play first.
//
// Audio has NO "auto"/"webview" fallback path: the player needs a real media URL
// (.mp3/.m4a/.aac/.flac/.m3u8). If the direct link can't be extracted, return
// Response.error so the failure is visible instead of a silent no-op.
//
// Lyrics go in `lyrics` — NOT `subtitles`, which the audio player never reads.
// Each entry's `data` may be a URL, a data: URI, or the raw lyric text itself.
// LRC ([mm:ss.xx]) gives synced highlight + auto-scroll; plain text renders
// unsynced. Only the first entry is used.
function resolveDirectAudio(pageUrl) {
    let r = fetch(pageUrl, { headers: { "User-Agent": UserAgent.chrome(), "Referer": BASE_URL } });
    if (!r.ok) return "";
    let text = r.text();
    let m = text.match(/https?[:\\\/]+[^"'\s\\]+\.(?:mp3|m4a|aac|flac|ogg|opus)[^"'\s\\]*/i);
    if (m) return m[0].replace(/\\/g, "");
    m = text.match(/https?[:\\\/]+[^"'\s\\]+\.m3u8[^"'\s\\]*/i);
    if (m) return m[0].replace(/\\/g, "");
    return "";
}

// Return [] when the site has no lyrics — never a fabricated placeholder.
function resolveLyrics(pageUrl) {
    let r = fetch(pageUrl, { headers: { "User-Agent": UserAgent.chrome(), "Referer": BASE_URL } });
    if (!r.ok) return [];

    // Preferred: a real .lrc file, so the pane can highlight and auto-scroll.
    let m = r.text().match(/https?[:\\\/]+[^"'\s\\]+\.lrc[^"'\s\\]*/i);
    if (m) return [{ data: m[0].replace(/\\/g, ""), type: "lrc" }];

    // Fallback: lyrics rendered into the page — send the text itself.
    let node = r.html().select("SELECTOR_LYRICS_NODE").first();
    if (node) {
        let text = node.html().replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").trim();
        if (text) return [{ data: text, type: "txt" }];
    }
    return [];
}

function execute(data) {
    let url = data;
    if (!/\.(?:mp3|m4a|aac|flac|ogg|opus|m3u8)(?:[?#]|$)/i.test(data)) {
        url = resolveDirectAudio(data);
    }
    if (!url) return Response.error("Không lấy được link audio");

    return Response.success({
        type: "native",
        data: url,
        host: BASE_URL,
        mimeType: url.indexOf(".m3u8") !== -1 ? "application/x-mpegURL" : "audio/mpeg",
        headers: { "User-Agent": UserAgent.chrome(), "Referer": BASE_URL },
        // Only when the site offers several qualities — first entry wins.
        audios: [],
        lyrics: resolveLyrics(data)
    });
}
