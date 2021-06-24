function execute(url, page) {
    if (!page) page = '1';

    var doc = Http.get(url + "/page" + page).html();

    if (doc) {
        var el = doc.select(".tabtruyen [itemtype]");
        var novelList = [];
        var next = doc.select(".phantrangactive + a").first().text();
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            e.select(".fullicon").remove();
            novelList.push({
                name: e.select(".tabtruyen-name").text(),
                link: e.select("a").first().attr("href"),
                description: e.select("[itemprop=author]").text(),
                cover: e.select(".tabtruyen-img").attr("src"),
                host: "https://thichdoctruyen.com",
            });

        }
        return Response.success(novelList, next);
    }
    return null;
}