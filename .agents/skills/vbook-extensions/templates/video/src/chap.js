load('config.js');
// One entry per server; `data` goes verbatim to track.js. The title is the server's identity:
// keep titles unique and non-empty. Always return an array.
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let servers = [];
    let seen = {};
    doc.select("SELECTOR_SERVER_BUTTONS").forEach(function (el) {
        let data = el.attr("SELECTOR_SERVER_DATA_ATTR");   // e.g. data-link / data-embed / href
        if (!data) return;
        if (data.indexOf("//") === 0) data = "https:" + data;
        else if (data.indexOf("http") !== 0) data = BASE_URL + (data.charAt(0) === "/" ? "" : "/") + data;
        let title = el.text().trim() || "Server " + (servers.length + 1);
        if (seen[title]) title += " " + (servers.length + 1);
        seen[title] = true;
        servers.push({ title: title, data: data });
    });

    if (servers.length === 0) servers.push({ title: "Server 1", data: url });
    return Response.success(servers);
}
