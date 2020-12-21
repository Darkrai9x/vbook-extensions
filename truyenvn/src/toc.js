function execute(url) {
    var doc = Http.get(url).html();

    var el = doc.select("#chapterList a")
    const data = [];
    for (var i = el.size() - 1; i >= 0; i--) {
        var e = el.get(i);
        data.push({
            name: e.select("span").first().text(),
            url: e.attr("href"),
            host: "https://truyenvn.com"
        })
    }

    return Response.success(data);
}