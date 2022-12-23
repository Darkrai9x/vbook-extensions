function execute(url) {
    load('config.js');
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    var doc = Http.get(url).html();
    if (doc) {
        var el = doc.select(".book-list > .list-chap > div:nth-child(1) li a");
        var list = [];
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            list.push({
                name: e.text(),
                url: e.attr("href").trim(),
                host: BASE_URL
            });
        }
        return Response.success(list);
    }
    return null;
}