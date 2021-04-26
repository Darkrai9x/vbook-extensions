function execute(url, page) {
    var doc;
    if (!page) {
        doc = Http.get(url).html();
    } else {
        doc = Http.get("https://truyentranhaudio.online/" + page).html();
    }

    var next = doc.select("li:has(a.active) + li").select("a").attr("href");

    const el = doc.select(".row-last-update .thumb-item-flow");

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        var cover = e.select("div.content.img-in-ratio").first().attr("data-bg");
        if (cover.startsWith("//")) {
            cover = "https:" + cover;
        }
        data.push({
            name: e.select("a").last().text(),
            link: e.select("a").last().attr("href"),
            cover: cover,
            description: e.select(".chapter-title").text(),
            host: "https://truyentranhaudio.online"
        })
    }

    return Response.success(data, next)
}