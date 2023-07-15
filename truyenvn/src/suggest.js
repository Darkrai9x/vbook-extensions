load('config.js');
function execute(input) {
    let doc = Html.parse(input);
    let books = [];
    doc.select(".entry.text-center").forEach(e => {
        books.push({
            name: e.select("h2 a").text(),
            link: e.select("h2 a").attr("href"),
            cover: e.select("img").first().attr("data-src"),
            description: "Lượt xem: " + e.select(".bg-info").text(),
            host: BASE_URL
        })
    });

    return Response.success(books);

}