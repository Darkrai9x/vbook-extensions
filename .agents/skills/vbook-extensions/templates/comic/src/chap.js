load('config.js');
// Return an array of image URLs. Images load with Referer = chapter URL; if the CDN rejects
// it, return { link: src, referrerpolicy: "no-referrer" } (or "origin") instead.
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let images = [];
    doc.select("SELECTOR_PAGE_IMAGES img").forEach(function (el) {
        let src = el.attr("data-src") || el.attr("src");   // lazy-loaded sites use data-src
        if (src.indexOf("//") === 0) src = "https:" + src;
        if (src) images.push(src);
    });
    return Response.success(images);
}
