load('config.js');
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    return Response.success({
        name: doc.select("SELECTOR_TITLE").text(),
        author: doc.select("SELECTOR_ARTIST").text(),
        cover: doc.select("SELECTOR_COVER img").attr("src"),
        description: doc.select("SELECTOR_DESC").html(),
        detail: doc.select("SELECTOR_INFO").html(),
        url: url,
        type: "audio",
        format: "album", // "album" = playlist (each TOC entry a track), "audio" = single track
        ongoing: false,
        // Shown as chips; `tags` is not displayed.
        genres: doc.select("SELECTOR_GENRE_LINKS a").map(function (el) {
            return { title: el.text(), input: el.attr("href"), script: "search.js" };
        }),
        suggests: [
            { title: "Có thể bạn thích", input: doc.select("SELECTOR_SIMILAR_WIDGET").html(), script: "similar.js" }
        ],
        comments: [
            { title: "Bình luận", input: doc.select("SELECTOR_COMMENT_LINK").attr("href"), script: "comments.js" }
        ]
    });
}
