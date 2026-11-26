load('config.js');
// Each entry is one episode.
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    return Response.success(doc.select("SELECTOR_EPISODE_LINKS a").map(function (el) {
        return { name: el.text(), url: el.attr("href") };
    }));
}
