function execute(url) {
    var doc = Http.get(url).headers({"X-Requested-With": "XMLHttpRequest"}).html();

    var el = doc.select("a")
    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.text(),
            url: e.attr("href"),
            host: "http://truyencuatui.net"
        })
    }

    return Response.success(data);
}