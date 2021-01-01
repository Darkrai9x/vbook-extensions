function execute(url, page) {
    const doc = Http.get(url).html()

    const el = doc.select("ul.single-list-comic > li")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.select("a").first().text(),
            link: e.select("a").first().attr("href"),
            cover: e.select("img").first().attr("data-gra"),
            description: e.select(".cat-score").first().text(),
            host: "https://www.ngonphong.com"
        })
    }

    return Response.success(data)
}