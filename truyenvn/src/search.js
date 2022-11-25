function execute(key, page) {
    const doc = Http.get("https://truyenvnhot.com/danh-sach-truyen?q=" + key).html();

    const el = doc.select(".comics-grid .entry")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.select("h3.name a").first().text(),
            link: e.select("h3.name a").first().attr("href"),
            cover: e.select("img").first().attr("data-src"),
            description: e.select("h4 a").text(),
            host: "https://truyenvnhot.com"
        })
    }

    return Response.success(data)
}