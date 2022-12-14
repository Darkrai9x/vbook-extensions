load('bypass.js');

function execute(url) {
    url = url.replace("truyenqq.com", "truyenqq.net");
    url = url.replace("truyenqq.net", "truyenqqtop.com");
    url = url.replace("truyenqqtop.com", "truyenqqvip.com");
    url = url.replace("truyenqqvip.com", "truyenqqpro.com");
    url = url.replace("truyenqqpro.com", "truyenqqvip.com");

    var doc = bypass(url, Http.get(url).html());
    if(doc) {
        var list = [];
        var el = doc.select(".works-chapter-list a");
        for (var i = el.size() - 1; i >= 0; i--) {
            var e = el.get(i);
            list.push({
                name: e.text(),
                url: e.attr("href"),
                host: "https://truyenqqvip.com",
            });
        }
        return Response.success(list);
    }

    return null;
}