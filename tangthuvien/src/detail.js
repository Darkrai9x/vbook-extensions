load("config.js");
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let genres = [];
        doc.select("li.tags .detail a.tags").forEach(e => {
            genres.push({
                title: e.text(),
                input: e.attr("href"),
                script: "gen.js"
            });
        });

        return Response.success({
            name: doc.select("h1").text(),
            cover: doc.select("div.book-img img").attr("src"),
            author: doc.select("div.book-information div.book-info a").first().text(),
            description: doc.select("div.book-info-detail div.book-intro").html(),
            detail: doc.select(".book-info > p").get(2).text().replace(/\|/g, "<br>"),
            genres: genres,
            suggests: [
                {
                    title: "Có thể bạn sẽ thích",
                    input: doc.select(".like-more-list").html(),
                    script: "suggest.js"
                }
            ],
            comment: {
                input: doc.select("input[name=story_id]").attr("value"),
                script: "comment.js"
            },
            host: BASE_URL,
            ongoing: doc.select("p.tag").html().indexOf(">Đang ra<") >= 0
        });
    }
    return null;
}