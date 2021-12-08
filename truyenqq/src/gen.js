load('bypass.js');

function execute(url, page) {
    if (!page) page = '1';
    url = url.replace(".html", "") + "/trang-" + page + ".html";
    var doc = bypass(url, Http.get(url).html());

    if (doc) {
        var el = doc.select("ul.list-stories .story-item");
        var novelList = [];
        var next = doc.select(".pagination-list").select("li:has(a.is-current) + li").last().select("a").text();
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            novelList.push({
                name: e.select(".title-book").text(),
                link: e.select(".title-book a").first().attr("href"),
                description: e.select(".episode-book").text(),
                cover: e.select("img.story-cover").attr("src"),
                host: "https://truyenqqvip.com"
            });
        }

        return Response.success(novelList, next)
    }

    return null;
}