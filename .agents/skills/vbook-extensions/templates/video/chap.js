load('config.js');
// chap.js (video: step 1 of chap->track) — list the playable servers/sources for
// one episode. Each entry becomes a user-selectable source; its `data` is passed
// to track.js to resolve the real stream. Return a one-element list for a
// single-server site.
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let servers = [];
    doc.select("SELECTOR_SERVER_BUTTONS").forEach(function (el) {
        let data = el.attr("SELECTOR_SERVER_DATA_ATTR"); // e.g. data-link / data-embed / href
        if (!data) return;
        servers.push({ title: el.text().trim() || "Server", data: data });
    });

    if (servers.length === 0) {
        servers.push({ title: "Mặc định", data: url });
    }

    return Response.success(servers);
}
