function execute(url, page) {
    if (!page) page = '1';
    const doc = Http.get(url).params({"page": page}).html();

    var next = doc.select(".pagination").select("li.active + li").select("a").text();

    const el = doc.select(".truyen-list .truyen-inner")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.select("a.title").first().text(),
            link: e.select("a.title").first().attr("href"),
            cover: e.select("a.title").first().attr("data-src"),
            description: e.select("a.category").text(),
            host: "https://truyencuatui.net"
        })
    }

    return Response.success(data, next)
}