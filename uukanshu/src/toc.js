function execute(url) {
    if (url.indexOf("sj.uukanshu.com") === -1) {
        var bookId = url.match(/\/b\/(\d+)\/?$/)[1];
        url = "https://sj.uukanshu.com/book.aspx?id=" + bookId;
    }
    var doc = Http.get(url).html();

    if (doc) {

        var el = doc.select("#chapterList a")
        var data = [];
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            data.push({
                name: e.select("a").text(),
                url: e.attr("href"),
                host: "https://sj.uukanshu.com"
            })
        }

        var page = doc.select(".pages a").last().attr("href").match(/page=(\d+)/);
        if (page) {
            page = parseInt(page[1]);
            if (page > 1) {
                for (var p = 2; p <= page; p++) {
                    doc = Http.get(url + "&page=" + p).html();
                    var el = doc.select("#chapterList a")
                    for (var i = 0; i < el.size(); i++) {
                        var e = el.get(i);
                        data.push({
                            name: e.select("a").text(),
                            url: e.attr("href"),
                            host: "https://sj.uukanshu.com"
                        })
                    }
                }
            }
        }

        return Response.success(data);
    }

    return null;
}