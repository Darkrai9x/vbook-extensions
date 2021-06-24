function execute(url) {
    var doc = Http.get(url).html();
    if (doc) {
        var el = doc.select(".sachmoi .view-content .views-row");
        var novelList = [];
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            novelList.push({
                name: e.select(".smtitle").first().select("a").text(),
                link: e.select(".smimg").first().select("a").attr("href"),
                cover: e.select(".smimg").first().select("a img").attr("src"),
                description: e.select(".smauthor").text(),
                host: "https://gacsach.com"
            });

        }
        return Response.success(novelList);
    }
    return null;
}