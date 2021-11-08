function execute(url) {
    url = url.replace("truyentr.vn", "truyentr.info");
    var doc = Http.get(url).html();
    if (doc) {
        var el = doc.select(".list-chapters a");
        var list = [];
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            list.push({
                name: e.text(),
                url: e.attr("href").trim(),
                host: "http://truyentr.info"
            });
        }
        return Response.success(list);
    }
    return null;
}