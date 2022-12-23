function execute(url) {
    load('config.js');
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    var doc = Http.get(url).html();
    if (doc) {
        var page = doc.select(".nexts a").attr("href").match(/page=(\d+)/);
        if (!page) {
            var size = parseInt(doc.select(".pagination > li").size());
            if (size > 0) {
                page = doc.select(".pagination > li > a").get(size - 2).attr("href").match(/trang=(\d+)/);
            }
        }
        if (page) page = parseInt(page[1]); else page = 1;
        var list = [];
        for (var i = 1; i <= page; i++) {
            list.push(url + "/?page=" + i);
        }
        return Response.success(list);
    }

    return null;
}