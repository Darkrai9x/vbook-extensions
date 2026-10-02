// chap.js — comic chapter content: return the chapter's image URL array. This
// is where a comic's images live (the app reads chapter content from chap).
// page.js is unrelated — it's optional TOC pagination, not the image list.
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
