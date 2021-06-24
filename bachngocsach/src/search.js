function execute(key, page) {
    if (!page) page = '0';
    var doc = Http.get("https://bachngocsach.com/reader/search?ten=" +key+ "&page=" + page).html();

    var el = doc.select("div.view-content li.search-row");
    var novelList = [];

    var next = doc.select(".pager-next").last().select("a").attr("href").match(/page=(\d+)/);
    if (next) next = next[1];

    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        novelList.push({
            name: e.select("div.search-truyen a").text(),
            link: e.select("div.search-truyen a").attr("href"),
            cover: e.select("div.search-anhbia img").attr("src"),
            description: e.select("div.search-tacgia a").text(),
            host: "https://bachngocsach.com"
        });
    }

    return Response.success(novelList, next);
}
