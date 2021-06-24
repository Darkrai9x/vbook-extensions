function execute(url, page) {
    if (!page) page = '0';
    var doc = Http.get(url + "/?page=" + page).html();

    var el = doc.select(".view-content .term-row");
    var novelList = [];

    var next = doc.select(".pager-next").last().select("a").attr("href").match(/page=(\d+)/);
    if (next) next = next[1];

    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        novelList.push({
            name: e.select("a.term-truyen-a").text(),
            link: e.select("a.term-truyen-a").attr("href"),
            cover: e.select(".term-anhbia-a > img").attr("src"),
            description: e.select(".term-tacgia").text(),
            host: "https://bachngocsach.com"
        });
    }

    return Response.success(novelList, next);
}