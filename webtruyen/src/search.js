function execute(key, page) {
    var doc;
    if (page) {
        doc = Http.get(page).html();
    } else {
        doc = Http.get("https://dtruyen.com/search/?key=" + key).html();
    }

    var next = doc.select(".pagination").select("li.active + li").select("a").attr("href");

    const el = doc.select(".list-stories .story-list")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.select(".info h3").first().text(),
            link: e.select(".info h3 a").first().attr("href"),
            cover: e.select(".thumb img").first().attr("data-layzr"),
            description: e.select(".last-chapter").first().text(),
            host: "https://dtruyen.com"
        })
    }

    return Response.success(data, next);
}