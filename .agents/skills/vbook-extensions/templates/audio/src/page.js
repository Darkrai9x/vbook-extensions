load('config.js');
// Optional (declare "page" in plugin.json) when one title's TOC spans several pages. URLs must be absolute; never return [].
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let pages = doc.select("SELECTOR_TOC_PAGE_LINKS a").map(function (el) {
        return normalizeUrl(el.attr("href"));
    });
    return Response.success(pages.length > 0 ? pages : [url]);
}
