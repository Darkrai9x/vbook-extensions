function execute(url, page) {
    if (!page) page = '0';
    var doc = Http.get(url + "/?page=" + page).html();

    var el = doc.select("ul.content-grid > li > div");
    var novelList = [];

    var next = doc.select(".pager-next").last().select("a").attr("href").match(/page=(\d+)/);
    if (next) next = next[1];

    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        novelList.push({
            name: e.select("div.recent-truyen a").text(),
            link: e.select("div.recent-truyen a").attr("href"),
            cover: e.select("div.recent-anhbia img").attr("src"),
            description: e.select("div.recent-chuong a").text(),
            host: "https://bachngocsach.com"
        });
    }

    return Response.success(novelList, next);
}