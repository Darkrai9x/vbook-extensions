function execute(key, page) {
    if (!page) page = '1';

    var doc = Http.get("https://truyenchu.vn/tim-kiem?tukhoa=" + key.replace(/ /g, "+") + "&page=" + page).html();

    if (doc) {
        var el = doc.select(".list-truyen div[itemscope]");
        var novelList = [];
        var next = doc.select(".pagination > li.active + li").last().text();
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            novelList.push({
                name: e.select(".truyen-title > a").text(),
                link: e.select(".truyen-title > a").first().attr("href"),
                description: e.select(".author").text(),
                cover: e.select("[data-classname=cover]").first().attr("data-image"),
                host: "https://truyenchu.vn",
            });

        }
        return Response.success(novelList, next);
    }
    return null;
}
