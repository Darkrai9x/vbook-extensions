load('config.js');
// Audio plays only the first entry with non-blank `data` (no server picker). Always return an array.
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let data = doc.select("SELECTOR_SOURCE_NODE").attr("SELECTOR_SOURCE_DATA_ATTR");   // e.g. data-src / href
    return Response.success([{ title: "Mặc định", data: data || url }]);
}
