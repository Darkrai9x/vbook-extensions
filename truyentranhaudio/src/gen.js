function execute(url, page) {
    var doc;
    if (!page) {
        doc = Http.get(url).html();
    } else {
        doc = Http.get("https://truyentranhaudio.org/" + page).html();
    }

    var next = doc.select(".pagination .active + li").select("a").attr("href");
    const el = doc.select("#ctl00_divCenter > div > div > div > div.row");
    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        var cover = e.select("figure > div > a > img").first().attr("src");
        if (cover.startsWith("//")) {
            cover = "https:" + cover;
        }
        data.push({
            name: e.select("figure > figcaption > h3 > a").last().text(),
            link: e.select("figure > figcaption > h3 > a").last().attr("href"),
            cover: cover,
            description: null,
            host: "https://truyentranhaudio.org"
        })
    }

    return Response.success(data, next)
}