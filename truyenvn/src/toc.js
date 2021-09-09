function execute(url) {
    url = url.replace("truyenvn.com", "truyenvn.tv");
    var doc = Http.get(url).html();

    var el = doc.select("#chapterList a")
    const data = [];
    for (var i = el.size() - 1; i >= 0; i--) {
        var e = el.get(i);
        data.push({
            name: e.select("span").first().text(),
            url: e.attr("href"),
            host: "https://truyenvn.tv"
        })
    }

    return Response.success(data);
}