load('config.js');
function execute(input) {
    let doc = Html.parse(input);
    let books = [];
    doc.select(".related-reading-wrap").forEach(e => {
        books.push({
            name: e.select(".widget-title").first().text(),
            link: e.select("a").first().attr("href"),
            cover: e.select("img").first().attr("data-lazy-src"),
            description: e.select(".post-on").text(),
            host: BASE_URL
        })
    });

    return Response.success(books);

}