load('config.js');
// toc.js (audio) — the track list. This IS the player's playlist: entry order and
// `name` are what the user sees. A single-song ("audio" format) page still
// returns a one-element list.
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let tracks = [];
    doc.select("SELECTOR_TRACK_ROWS").forEach(function (el) {
        let link = el.select("a").first();
        if (!link) return;
        tracks.push({
            name: link.text().trim(),
            url: link.attr("href"),
            // Shown under the track title — artist / duration text if the page has it.
            description: el.select("SELECTOR_TRACK_ARTIST").text(),
            lock: false,
            pay: false
        });
    });

    if (tracks.length === 0) {
        tracks.push({ name: doc.select("SELECTOR_TITLE").text(), url: url, description: "", lock: false, pay: false });
    }

    return Response.success(tracks);
}
