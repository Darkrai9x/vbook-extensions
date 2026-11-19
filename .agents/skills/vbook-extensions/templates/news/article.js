load('config.js');
// article.js — `url` is the tapped list item's `link`. Returns the article itself.
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    return Response.success({
        name: doc.select("SELECTOR_TITLE").text(),
        author: doc.select("SELECTOR_AUTHOR").text(),
        cover: doc.select("meta[property='og:image']").attr("content"),
        time: doc.select("SELECTOR_TIME").attr("datetime"),   // display text or epoch
        source_name: "Site Name",
        tags: doc.select("SELECTOR_TAGS a").map(function (a) { return a.text(); }),
        content: doc.select("SELECTOR_CONTENT").html(),
        content_format: "html"                                // "html" | "markdown"
        // Optional comment sources, like detail's `comments`:
        // comments: [{ title: "Bình luận", input: url, script: "comments.js" }]
    });
}
