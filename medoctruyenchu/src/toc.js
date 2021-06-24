function execute(url) {
    var doc = Http.get(url).html();
    if (doc) {
        var list = [];
        var el = doc.select(".chapter_pages a");
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            list.push({
                name: e.text(),
                url: e.attr("href"),
                host: "https://www.medoctruyenchu.net"
            });
        }
        return Response.success(list);
    }
    return null;
}