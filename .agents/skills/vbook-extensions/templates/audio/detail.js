load('config.js');
// detail.js (audio) — `format` decides the player's track list:
//   "album" = many tracks (playlist UI), "audio" = one track (single-song UI).
// Both use the same player; only the list differs. Get this wrong and a
// multi-track album shows as a single song.
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
        format: "album", // "album" (playlist) or "audio" (single track)
        ongoing: false,
        tags: doc.select("SELECTOR_GENRE_LINKS a").map(function (el) {
            return { title: el.text(), input: el.attr("href"), script: "search.js" };
        }),
        genres: [
            { title: "Cùng thể loại", input: doc.select("SELECTOR_GENRE_LINKS a").first().attr("href"), script: "search.js" }
        ],
        suggests: [
            { title: "Có thể bạn thích", input: doc.select("SELECTOR_SIMILAR_WIDGET").html(), script: "similar.js" }
        ],
        comments: [
            { title: "Bình luận", input: doc.select("SELECTOR_COMMENT_LINK").attr("href"), script: "comments.js" }
        ]
    });
}
