function execute(url) {
    var list = [];
    var el;
    if (url.indexOf("s3.truyenhd.com") > 0) {
        var doc = Http.get(url).html();
        el = doc.select(".listchap").last().select("li a");
    } else {
        var doc = Http.get("https://s3.truyenhd.com" + url).html();
        var bookId = doc.select("#views").attr("data-id");
        var ajaxDoc = Http.post("https://s3.truyenhd.com/wp-admin/admin-ajax.php").params({
            "action": "all_chap",
            "id": bookId
        }).html();
        el = ajaxDoc.select("a");
        if (el.isEmpty()) {
            var page = doc.select("#pagination").text().match(/1\/(\\d+)/);
            if (page) {
                page = parseInt(page);

                for (var i = 1; i <= page; i++) {
                    list.push({
                        name: "Phần " + i,
                        url: "https://s3.truyenhd.com" + url + "/" + i,
                        host: "https://s3.truyenhd.com"
                    });
                }
                return Response.success(list);
            }
        }
    }

    if (el) {
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            list.push({
                name: e.text(),
                url: e.attr("href"),
                host: "https://s3.truyenhd.com"
            });
        }
        return Response.success(list);
    }

    return null;
}