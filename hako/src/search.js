function execute(key, page) {
    if (!page) page = '1';

    var doc = Http.get("https://ln.hako.re/tim-kiem").params({keywords: key, page: page}).html();
    if (doc) {
        var el = doc.select(".sect-body .thumb-item-flow");
        var novelList = [];
        var next = doc.select(".pagination-footer a.current + a").text()

        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            novelList.push({
                name: e.select(".series-title a").text(),
                link: e.select(".series-title a").attr("href"),
                description: e.select(".chapter-title").text(),
                cover: e.select(".img-in-ratio").attr("data-bg"),
                host: "https://ln.hako.re"
            });

        }

        return Response.success(novelList, next);
    }
    return null;
}
