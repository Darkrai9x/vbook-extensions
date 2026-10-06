// page.js — OPTIONAL TOC pagination. Declare it only when the site splits one
// title's episode list over multiple pages. Return absolute page URLs in order;
// the app calls toc.js on every returned URL.
load('config.js');
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let pages = doc.select("SELECTOR_TOC_PAGE_LINKS a").map(function (el) {
        return el.absUrl("href");
    });

    return Response.success(pages);
}
