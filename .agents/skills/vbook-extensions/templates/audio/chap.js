load('config.js');
// chap.js (audio: step 1 of chap->track) — resolve ONE track url to a source
// handle, which the app passes to track.js.
//
// Differences from video's chap.js, both of which bite:
//   1. The audio player does NOT show a server picker. It takes the FIRST entry
//      only. Put the best source first; extra entries are ignored, not offered.
//   2. Return an ARRAY or an OBJECT — never a bare URL string. The app parses
//      this payload as JSON and reads `data`/`url`/`link` off it; a bare string
//      fails to parse and the raw chapter path is passed to track.js instead.
//      Return [{ data: "..." }] even when there is exactly one source.
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let sources = [];
    doc.select("SELECTOR_SOURCE_NODES").forEach(function (el) {
        let data = el.attr("SELECTOR_SOURCE_DATA_ATTR"); // e.g. data-src / data-file / href
        if (!data) return;
        sources.push({ title: el.text().trim() || "Mặc định", data: data });
    });

    if (sources.length === 0) {
        // No explicit source node — hand the page url to track.js and resolve there.
        sources.push({ title: "Mặc định", data: url });
    }

    return Response.success(sources);
}
