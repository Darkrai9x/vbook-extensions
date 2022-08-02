function execute(url) {
    url = url.replace("s3.truyenhd.com", "truyenhd1.com");
    url = url.replace("truyenhd1.com", "truyenhdz.com");
    url = url.replace("truyenhdz.com", "truyenhdd.com");
    var list = [];
    var el;
    if (url.indexOf("truyenhdd.com") > 0) {
        var doc = Http.get(url).html();
        el = doc.select(".listchap").last().select("li a");
    } else {
        var doc = Http.get("https://truyenhdd.com" + url).html();
        var bookId = doc.select("#views").attr("data-id");
        var ajaxDoc = Http.post("https://truyenhdd.com/wp-admin/admin-ajax.php").params({
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
                        url: "https://truyenhdd.com" + url + "/" + i,
                        host: "https://truyenhdd.com"
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
                host: "https://truyenhdz.com"
            });
        }
        return Response.success(list);
    }

    return null;
}