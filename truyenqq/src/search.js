load('bypass.js');

function execute(key, page) {
    if (!page) page = '1';
    var url = "http://truyenqqpro.com/tim-kiem/trang-" + page + ".html?q=" + key;
    var doc = bypass(url, Http.get(url).html());

    if (doc) {
        var el = doc.select("#main_homepage .list_grid li");
        var novelList = [];
        var next = doc.select(".page_redirect").select("a:has(p.active) + a").last().text();
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            novelList.push({
                name: e.select(".book_name").text(),
                link: e.select(".book_name a").first().attr("href"),
                description: e.select(".last_chapter").text(),
                cover: e.select(".book_avatar img").attr("src"),
                host: "http://truyenqqpro.com"
            });
        }

        return Response.success(novelList, next)
    }

    return null;
}
