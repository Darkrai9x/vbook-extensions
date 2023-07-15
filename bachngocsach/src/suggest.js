load('config.js');
function execute(input) {
    let doc = Html.parse(input);
    let books = [];
    doc.select(".same_author-row").forEach(e => {
        books.push({
            name: e.select("a.title").text(),
            link: e.select("a.title").attr("href"),
            cover: e.select("img").first().attr("src"),
            description: e.select(".gioithieu").text(),
            host: BASE_URL
        })
    });

    return Response.success(books);

}