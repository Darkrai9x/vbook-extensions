function execute(url, page) {
    var doc;
    if (!page) page = '1';
    var doc = Http.get(url + "/page/" + page).html();

    if (doc) {
        var el = doc.select(".theloai-thumlist li");
        var novelList = [];
        var next = doc.select(".pagination li.active + li").text();
        for (var i = 0; i< el.size(); i++) {
            var e = el.get(i);
            var cover = e.select(".thumbnail img").attr("data-src");
            if (!cover)
                cover = e.select(".thumbnail img").attr("src");
            novelList.push({
                name: e.select("h2").last().text(),
                link: e.select(" a").attr("href"),
                cover: cover,
                description: e.select(".content p").first().text(),
                host: "https://truyenvkl.com"
            });
        }

        return Response.success(novelList, next);
    }
    return null;
}