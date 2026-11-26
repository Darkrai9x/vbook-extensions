load('config.js');
// The track list is the player's playlist; a single-track page still returns one entry.
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let tracks = [];
    doc.select("SELECTOR_TRACK_ROWS").forEach(function (el) {
        let link = el.select("a").first();   // empty element (not null) when missing
        if (!link.attr("href")) return;
        tracks.push({
            name: link.text().trim(),
            url: link.attr("href"),
            description: el.select("SELECTOR_TRACK_ARTIST").text()
        });
    });

    if (tracks.length === 0) tracks.push({ name: doc.select("SELECTOR_TITLE").text(), url: url });
    return Response.success(tracks);
}
