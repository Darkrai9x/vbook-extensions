function execute(url) {
    var doc = Http.get(url).html();
    if (doc) {
        var el = doc.select(".list-chapter li a");
        var list = [];
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            list.push({
                name: e.text(),
                url: e.attr("href").trim(),
                host: "http://truyentr.vn"
            });
        }
        return Response.success(list);
    }
    return null;
}