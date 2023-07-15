load('config.js');
function execute(input, next) {
    let url = BASE_URL;
    if (next) {
        url += "/them-comment/" + input + "?page=" + next + "&new_web=1";
    } else {
        url += "/story/comments?story_id=" + input + "&new_web=1";
    }
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let comments = [];
        doc.select("li").forEach(e => {
            comments.push({
                name: e.select(".users a").text(),
                content: e.select(".text ").text(),
                description: e.select(".info .mr20").first().text()
            });
        });

        let next = doc.select(".go-discuss a").attr("data-page");
        if (next) {
            next = (parseInt(next) + 1) + "";
        }

        return Response.success(comments, next);
    }

    return null;
}