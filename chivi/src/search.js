function execute(key, page) {

    if (!page) {
        page = "1";
    }

    var doc = Http.get("https://chivi.xyz/search?q=" + key + "&p=" + page).html();

    const novelList = [];
    var next = "";

    if (doc) {
        var el = doc.select(".list .book")
        var nextPage = doc.select(".pagi a._primary").attr("href");

        const pageRegex = /.*p=(\d+)/g;
        const result = pageRegex.exec(nextPage);
        if (result) {
            next = result[1];
        }

        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            novelList.push({
                "name": e.select(".infos  ._title").text(),
                "link": e.select("a").first().attr("href"),
                "description": e.select(".infos  ._author").text(),
                "cover": e.select(".cover img").first().attr("src"),
                "host": "https://chivi.xyz"
            });
        }
    }

    return Response.success(novelList, next);
}