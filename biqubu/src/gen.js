function execute(url, page) {
    const doc = Http.get("https://www.biqubu.com" + url).html();

    const el = doc.select("#newscontent .l li")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        var link = e.select(".s2 a").first().attr("href");
        var regex = /book_(\d+)/g;
        var bookId = regex.exec(link);
        var cover = "";
        if (bookId) {
            var id = bookId[1];
            cover = "https://www.biqubu.com/files/article/image/" + Math.floor(id / 1000) + "/" + id + "/" + id + "s.jpg"
        }

        data.push({
            name: e.select(".s2 a").first().text(),
            link: e.select(".s2 a").first().attr("href"),
            cover: cover,
            description: e.select(".s3 a").first().text(),
            host: "https://www.biqubu.com"
        })
    }

    return Response.success(data)
}