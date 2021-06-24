function execute(key, page) {
    if (!page) page = '1';

    var doc = Http.get("https://truyen.tangthuvien.vn/ket-qua-tim-kiem")
        .params({term: key, page:page})
        .html();

    if (doc) {
        var el = doc.select("#rank-view-list ul li");
        var novelList = [];
        var next = doc.select("ul.pagination > li > a").last().attr("href").match(/page=(\d+)/);
        if (next) next = next[1]; else next = '';
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            novelList.push({
                name: e.select("h4 > a").text(),
                link: e.select("h4 > a").attr("href"),
                description: e.select(".author").text(),
                cover: e.select("img").first().attr("src"),
                host: "https://truyen.tangthuvien.vn"
            });

        }

        return Response.success(novelList, next);
    }

    return null;
}
