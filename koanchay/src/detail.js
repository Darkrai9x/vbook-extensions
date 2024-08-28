load("config.js");
load('bypass.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();

        if (doc.select("[name=code]").length > 0) {
            bypass(url, response.request.headers.cookie);
            return Response.error("Bạn phải vào trang nguồn đăng nhập để có thể đọc.");
        } else if (doc.select("[data-action=login]").length > 0) {
            return Response.error("Bạn phải vào trang nguồn đăng nhập để có thể đọc.");
        }
        let comments = [];
        let genres = [];
        doc.select(".book-desc > p").first().select("a").forEach(e => {
            genres.push({
                title: e.text(),
                input: BASE_URL + e.attr('href'),
                script: "gen.js"
            });
        });
        let review = doc.select("a[href*=/review/truyen]").attr("href");
        if (review) {
            comments.push({
                title: "Đánh giá",
                input: BASE_URL + review,
                script: "book_review.js"
            });
        }

        let detail = '';
        doc.select(".cover-info > div").first().select("p").first().remove();
        doc.select(".cover-info > div").first().select("p").forEach(e => {
            detail += e.text() + "<br>";
        });

        let bookId = doc.select("input[name=bookId]").first().attr("value");

        let name = doc.select(".cover-info h2").text();
        let author = doc.html().match(/tac-gia.*?>(.*?)</);
        if (author) author = author[1];
        comments.push({
            title: "Bình luận",
            input: BASE_URL + "/comment?bookId=" + bookId + "&chapterId&order=newest",
            script: "comment.js"
        });
        return Response.success({
            name: name,
            cover: doc.select("div.book-info img").first().attr("src"),
            author: author,
            description: doc.select("div.book-desc-detail").html(),
            detail: detail,
            host: BASE_URL,
            ongoing: doc.select(".cover-info").html().indexOf("Còn tiếp") > 0,
            nsfw: true,
            genres: genres,
            suggests: [
                {
                    title: "Cùng thể loại",
                    input: doc.select(".desktop-similar-books").html(),
                    script: "similar.js"
                }
            ],
            comments: comments
        });
    }
    return null;
}