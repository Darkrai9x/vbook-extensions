function execute(key, page) {
    var doc;
    if (!page) {
        doc = Http.get("https://truyentranhaudio.org/danh-sach-truyen.html?name=" + key).html();
    } else {
        doc = Http.get("https://truyentranhaudio.org/" + page).html();
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
            host: "https://truyentranhaudio.org"
        })
    }

    return Response.success(data, next)
}