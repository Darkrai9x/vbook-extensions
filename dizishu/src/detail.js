load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let genres = [];
        doc.select(".tag font").forEach(e => {
            genres.push({
                title: e.text()
            });
        });
        return Response.success({
            name: doc.select(".book-text h1").text(),
            cover: doc.select(".book-img img").first().attr("src"),
            host: BASE_URL,
            author: doc.select(".book-text span").first().text(),
            description: doc.select(".intro").html(),
            detail: "",
            ongoing: doc.select(".tag span").last().text().indexOf("连载中") >= 0,
            genres: genres,
            suggests: [
                {
                    title: "同类推荐",
                    input: doc.select("#comment .good-wrap").html(),
                    script: "suggest.js"
                }
            ],
            comment: {
                input: doc.select("#comment .comment-wrap").html(),
                script: "comment.js"
            },
        });
    }
    return null;
}
