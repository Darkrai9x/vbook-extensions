// chap.js — REQUIRED comic per-chapter content. Return the ordered image URL
// array; page.js, when declared, only paginates the table of contents.
load('config.js');
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let images = doc.select("SELECTOR_PAGE_IMAGES img").map(function (el) {
        // Many comic sites lazy-load — prefer data-src over src.
        return el.attr("data-src") || el.attr("src");
    });

    return Response.success(images);
}
