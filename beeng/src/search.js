function execute(key, page) {
    if (!page) page = '1';
    const doc = Http.get("https://beeng.org/tim-kiem").params({"q": key, "page": page}).html()

    var next = doc.select(".paging").select("li:has(a.active) + li").text()

    const el = doc.select(".listComic .list > li")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.select(".detail a").first().text(),
            link: e.select(".detail a").first().attr("href"),
            cover: e.select(".cover img").first().attr("data-src"),
            description: e.select(".chapters a").first().text(),
            host: "https://beeng.org"
        })
    }

    return Response.success(data, next)
}