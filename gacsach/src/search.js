function execute(key, page) {
    if (!page) page = '0';

    var doc = Http.get("https://gacsach.com/find-book").params({
        title: key,
        page: page
    }).html();

    if (doc) {
        var el = doc.select(".view-content a");
        var novelList = [];
        var next = doc.select(".pager li.pager-current + li").last().select("a").text();
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            novelList.push({
                name: e.text(),
                link: e.attr("href"),
                host: "https://gacsach.com"
            });
        }

        return Response.success(novelList, next);
    }
    return null;
}
