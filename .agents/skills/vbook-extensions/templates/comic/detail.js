load('config.js');
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    return Response.success({
        name: doc.select("SELECTOR_TITLE").text(),
        author: doc.select("SELECTOR_AUTHOR").text(),
        cover: doc.select("SELECTOR_COVER img").attr("src"),
        description: doc.select("SELECTOR_DESC").html(),
        detail: doc.select("SELECTOR_INFO").html(),
        url: url,
        type: "comic",
        format: "comic",
        ongoing: doc.select("SELECTOR_STATUS").text().indexOf("Hoàn") === -1,
        // Genre/tag chips. The detail screen renders `genres` only — `tags` is not shown.
        genres: doc.select("SELECTOR_GENRE_LINKS a").map(function (el) {
            return { title: el.text(), input: el.attr("href"), script: "search.js" };
        }),
        // Similar/related comics — often rendered as a widget on the same page.
        suggests: [
            { title: "Có thể bạn thích", input: doc.select("SELECTOR_SIMILAR_WIDGET").html(), script: "similar.js" }
        ],
        reviews: [
            { title: "Đánh giá", input: doc.select("SELECTOR_REVIEW_LINK").attr("href"), script: "comments.js" }
        ],
        comments: [
            { title: "Bình luận", input: doc.select("SELECTOR_COMMENT_LINK").attr("href"), script: "comments.js" }
        ]
    });
}
