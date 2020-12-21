function execute(url) {
    var doc = Http.get(url).html();

    var el = doc.select(".listChapters .list a")
    const data = [];
    for (var i = el.size() - 1; i >= 0; i--) {
        var e = el.get(i);
        data.push({
            name: e.select(".titleComic").text(),
            url: e.attr("href"),
            host: "https://beeng.net"
        })
    }

    return Response.success(data);
}