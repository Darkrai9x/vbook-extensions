load('bypass.js');

function execute(key, page) {
    if (!page) page = '1';
    var url = "http://truyenqqpro.com/tim-kiem/trang-" + page + ".html?q=" + key;
    var doc = bypass(url, fetch(url).html());

    if (doc) {
        var novelList = [];
        var next = doc.select(".page_redirect").select("a:has(p.active) + a").last().text();
        doc.select("#main_homepage .list_grid li").forEach(e => {
            var cover = e.select(".book_avatar img").attr("src");
            if (cover.startsWith("//")) {
                cover = "http:" + cover;
            }
            novelList.push({
                name: e.select(".book_name").text(),
                link: e.select(".book_name a").first().attr("href"),
                description: e.select(".last_chapter").text(),
                cover: cover,
                host: "http://truyenqqpro.com"
            });
        });
        return Response.success(novelList, next)
    }

    return null;
}
