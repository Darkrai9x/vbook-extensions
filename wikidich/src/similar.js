load("config.js");
function execute(data) {

    let doc = Html.parse(data);
    let books = [];
    doc.select("li").forEach(e => {
        books.push({
            name: e.select(".book-title").text(),
            link: e.select("a.book-title").first().attr("href"),
            cover: e.select("img").attr("src"),
            description: e.select(".book-author").text(),
            host: BASE_URL
        });
    });

    return Response.success(books);
}