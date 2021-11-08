function execute(url) {
    var doc = Http.get(url).html();
    if (doc) {
        var page = doc.select(".nav-last > a").attr("href").match(/trang=(\d+)/);
        if (!page) {
            var size = parseInt(doc.select(".pagination > li").size());
            if (size > 0) {
                page = doc.select(".pagination > li > a").get(size - 2).attr("href").match(/trang=(\d+)/);
            }
        }

        if (page) page = parseInt(page[1]); else page = 1;
        var list = [];
        for (var i = 1; i <= page; i++) {
            list.push(url + "/?trang=" + i);
        }
        return Response.success(list);
    }

    return null;
}