function execute(key, page) {
    if (!page) page = '1';

    var doc = http.get("http://truyencv.com/tim-kiem/all/" + key + "/trang-" + page).html();

    if (doc) {
        var el = doc.select("div.block-content ul.list-group li");
        var list = [];
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            list.push({
                name: e.select(".info > .title > a").text(),
                link: e.select(".info > .title > a").attr("href"),
                cover: e.select("img").first().attr("src").replace("30x40", "100x150"),
                description: e.select(".author").text(),
                host: "https://truyencv.com"
            });

        }
        var pageNext = doc.select("li.active + li").text();
        if (!pageNext) pageNext = '';
        return Response.success(list, pageNext);
    }

    return null;
}