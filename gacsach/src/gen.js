function execute(url, page) {
    if (!page) page = '0';

    var doc = Http.get(url + "?page=" + page).html();

    if (doc) {
        var el = doc.select(".view-content tbody tr");
        var novelList = [];
        var next = doc.select(".pager li.pager-current + li").last().select("a").attr("href").match(/page=(\d+)/);
        if (next) next = next[1]; else next = '';
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            novelList.push({
                name: e.select(".tvtitle a").text(),
                link: e.select(".tvtitle a").attr("href"),
                cover: e.select(".tvanh img").attr("src"),
                description: e.select(".tvauthor").text(),
                host: "https://gacsach.com"
            });
        }

        return Response.success(novelList, next);
    }
    return null;
}