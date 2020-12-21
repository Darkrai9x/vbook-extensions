function execute(url) {
    var doc = Http.get(url).html();

    var el = doc.select(".nav-chapters .media > a")
    const data = [];
    for (var i = el.size() - 1; i >= 0; i--) {
        var e = el.get(i);
        data.push({
            name: e.select("a").text().replace(/\up.*/g, ""),
            url: e.attr("href"),
            host: "https://hentai2read.com"
        })
    }

    return Response.success(data);
}