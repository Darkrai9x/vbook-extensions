// page.js — OPTIONAL table-of-contents pagination (any content type). Only
// needed when a title's chapter/episode list spans multiple TOC pages. Return
// the list of TOC-page handles; the app calls toc() on each to get that page's
// entries. It is NOT per-chapter content — the chapter body/images/stream come
// from chap.js/track.js. If the whole list fits one toc() call, delete this
// file and drop "page" from plugin.json.script.
load('config.js');
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let pages = doc.select("SELECTOR_TOC_PAGE_LINKS a").map(function (el) {
        return { name: el.text(), url: el.attr("href") };
    });

    return Response.success(pages);
}
