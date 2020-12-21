function execute(url) {
    var doc = Http.get(url).html();

    var el = doc.select(".chapterList li a")
    const data = [];
    for (var i = el.size() - 1; i >= 0; i--) {
        var e = el.get(i);
        data.push({
            name: e.text(),
            url: e.attr("href"),
            host: "http://santruyen.com"
        })
    }

    return Response.success(data);
}