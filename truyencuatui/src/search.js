function execute(key, page) {
    if (!page) page = '1';
    const doc = Http.get("https://truyencuatui.net/search").params({ "q": key, "page": page }).html();

    var next = doc.select(".pagination").select("li.active + li").select("a").text();

    const el = doc.select(".panel-body .list-group-item")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.select("h4 a").text(),
            link: e.select("h4 a").first().attr("href"),
            description: e.select("h5").last().text(),
            host: "https://truyencuatui.net"
        })
    }

    return Response.success(data, next)
}