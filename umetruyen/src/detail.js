load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        let genres = [];
        doc.select(".genres-content").first().select("a").forEach(e => {
            genres.push({
                title: e.text(),
                input: BASE_URL + e.attr('href'),
                script: "gen.js"
            });
        });
        let comments = [];
        let commentslist = doc.select(".list_comment").html();
        comments.push({
            title: "Bình luận",
            input: commentslist,
            script: "comment.js"
        });
        return Response.success({
            name: doc.select(".post-title h1").first().text(),
            cover: doc.select(".summary_image img").first().attr("src"),
            author: doc.select(".author-content").first().text(),
            description: doc.select(".description-summary").html(),
            detail: getDetail(doc),
            host: BASE_URL,
            comments: comments,
            genres: genres,
            ongoing: doc.select(".post-content .post-content_item").text().indexOf("OnGoing") !== -1
        });
    }
    return null;
}
function getDetail(doc) {
    var items = doc.select(".post-content .post-content_item");
    var lines = [];

    for (var i = 0; i < items.size(); i++) {
        var item = items.get(i);

        var titleEl = item.select(".summary-heading h5").first();
        var valueEl = item.select(".summary-content").first();

        if (titleEl == null || valueEl == null) continue;

        var title = titleEl.text().trim();
        var value = valueEl.text().replace(/\s+/g, " ").trim();
        if (!value) continue;
        lines.push("<b>" + title + ":</b> " + value);
    }

    return lines.join("<br>");
}
