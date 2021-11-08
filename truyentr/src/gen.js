function execute(url, page) {
    if (!page) page = '1';

    var doc = Http.get(url + "/?trang-" + page).html();

    if (doc) {
        var el = doc.select(".cate-list-books > .list-item");
        var novelList = [];
        var next = doc.select(".pagination > li.active + li").last().text();
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            novelList.push({
                name: e.select(".truyen-title > a").text(),
                link: e.select(".truyen-title > a").first().attr("href"),
                description: e.select(".author").text(),
                cover: e.select("img").first().attr("src"),
                host: "https://truyentr.info",
            });

        }
        return Response.success(novelList, next);
    }
    return null;
}