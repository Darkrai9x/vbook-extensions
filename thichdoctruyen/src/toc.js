function execute(url) {
    var doc = Http.get(url).html();
    if (doc) {
        var list = [];
        doc.select(".phantranga").remove();
        doc.select("thead").remove();
        var el = doc.select("#dschuong a");
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            list.push({
                name: e.text(),
                url: e.attr("href"),
                host: "http://thichdoctruyen.com"
            });
        }
        return Response.success(list);
    }
    return null;
}
