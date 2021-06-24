function execute(key, page) {
    if (!page) page = '1';

    var doc = Http.get("https://blogtruyen.vn/timkiem/nangcao/1/0/-1/-1")
        .params({
            txt: key,
            p: page
        })
        .html();

    if (doc) {
        var el = doc.select(".list .tiptip");
        var novelList = [];
        var next = doc.select(".pagination > li.active + li").last().text();

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

        return Response.success(novelList, next)
    }
}
