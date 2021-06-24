function execute(id, page) {
    if (!page) page = '1';

    var doc = Http.get("https://blogtruyen.vn/ajax/Category/AjaxLoadMangaByCategory")
        .params({
            id: id,
            orderBy: "5",
            p: page
        })
        .html();
    if (doc) {
        var el = doc.select(".list .tiptip");
        var novelList = [];

        var next = doc.select(".paging > .current_page + .page").last().text();

        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            var id = e.attr("data-tiptip");

            var info = doc.select("#" + id);
            novelList.push({
                name: e.select("a").text(),
                link: e.select("a").attr("href"),
                cover: info.select("img").attr("src"),
                host: "https://blogtruyen.vn"
            });
        }

        return Response.success(novelList, next);
    }

    return null;
}