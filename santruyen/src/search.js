function execute(key, page) {
    var doc = null;
    if (!page) {
        doc = Http.post("http://santruyen.com/tim-kiem").params({ searchType: "story", searchKey: key }).html();
    } else {
        doc = Http.get("http://santruyen.com/tim-kiem/page-" + page).html();
    }

    var next = doc.select(".pagination li.active + li").text();

    var el = doc.select(".story-grid-view").last().select("li");
    var data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.select(".title").first().text(),
            link: e.select("a").first().attr("href"),
            cover: e.select("img").first().attr("src"),
            description: e.select(".meta-chapter").text(),
            host: "https://santruyen.com"
        })
    }

    return Response.success(data, next)
}