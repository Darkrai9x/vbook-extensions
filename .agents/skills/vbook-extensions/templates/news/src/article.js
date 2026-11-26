load('config.js');
// `url` is the list item's `link`; name/cover default to the list item's.
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    return Response.success({
        name: doc.select("SELECTOR_TITLE").text(),
        author: doc.select("SELECTOR_AUTHOR").text(),
        cover: doc.select("meta[property='og:image']").attr("content"),
        time: doc.select("SELECTOR_TIME").attr("datetime"),
        source_name: "Site Name",
        tags: doc.select("SELECTOR_TAGS a").map(function (a) { return a.text(); }),   // strings
        content: doc.select("SELECTOR_CONTENT").html(),
        content_format: "html"   // or "markdown"
        // comments: [{ title: "Bình luận", input: url, script: "comments.js" }]   // execute(input, next)
    });
}
