function execute(url) {
    url = url.replace("truyenvn.com", "truyenvn.tv");
    url = url.replace("truyenvn.tv", "truyenvn.vip");
    url = url.replace("truyenvn.vip", "truyenvnhot.com");
    url = url.replace("truyenvnhot.com", "truyenvnpro.com");
    var doc = Http.get(url).html();
    var el = doc.select(".content-text img");
    var imgs = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        var url = e.attr("src");
        if (!url.endsWith('truyenvn-tv-banner.jpg')
            && !url.endsWith('credit-truyenvn-tv.jpg')) {
            imgs.push(url);
        }
    }
    return Response.success(imgs);
}