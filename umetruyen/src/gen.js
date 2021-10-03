function execute(url, page) {
    var doc;
    if (!page) {
        doc = Http.get(url).html()
    } else {
        doc = Http.get("https://umetruyen.net/" + page).html()
    }


    var next = doc.select(".pager").select("li.active + li").select("a").attr("href");
    if (next) {
        if (!next.startsWith("http")) {
            next = "https://umetruyen.net/" + next;
        }
    }

    const el = doc.select("#danhsachtruyen > li")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.select("a.fed-list-title").first().text(),
            link: e.select("a[itemprop=url]").first().attr("href"),
            cover: e.select("a[itemprop=url]").first().attr("data-src"),
            description: e.select(".fed-list-desc").first().text(),
            host: "https://umetruyen.net"
        })
    }

    return Response.success(data, next)
}