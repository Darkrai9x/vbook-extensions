function execute(url) {
    url = url.replace("truyenvn.com", "truyenvn.tv");
    url = url.replace("truyenvn.tv", "truyenvn.vip");
    url = url.replace("truyenvn.vip", "truyenvnhot.com");
    url = url.replace("truyenvnhot.com", "truyenvnpro.com");
    var doc = Http.get(url).html();
    doc.select("img[src*='CREDIT-TRUYENVN-FROM-SEPT.jpg']").remove();
    var el = doc.select(".content-text img[loading*='lazy']");
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