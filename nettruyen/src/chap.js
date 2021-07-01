function execute(url) {
    url = url.replace("nettruyen.com", "nettruyenvip.com");
    url = url.replace("nettruyentop.com", "nettruyenvip.com");
    var doc = Http.get(url).html();
    var el = doc.select(".page-chapter img");
    
    var data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        var img = e.attr("data-original");
        if (!img) {
            img = e.attr("src");
        }

        if (img) {
            if (img.startsWith("//")) {
                img = "http:" + img;
            }
            data.push(img);
        }
    }
    return Response.success(data);
}