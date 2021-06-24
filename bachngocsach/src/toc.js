function execute(url) {
    var doc = Http.get(url + "/muc-luc?page=all").html();
    if (doc) {
        var list = [];
        var el = doc.select(".view-content .mucluc-chuong a");
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            list.push({
                name: e.text(),
                url: e.attr("href"),
                host: "http://bachngocsach.com"
            });

        }
        return Response.success(list);
    }
    return null;
}