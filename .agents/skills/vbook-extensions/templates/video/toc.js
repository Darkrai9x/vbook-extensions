load('config.js');
// toc.js — each entry is one episode
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let episodes = [];
    doc.select("SELECTOR_EPISODE_LINKS a").forEach(function (el) {
        episodes.push({
            name: el.text(),
            url: el.attr("href"),
            description: "",
            lock: false,
            pay: false
        });
    });

    return Response.success(episodes);
}
