function execute(url) {
    url = url.replace("nettruyen.com", "nettruyengo.com");
    url = url.replace("nettruyentop.com", "nettruyenmoi.com");
    url = url.replace("nettruyenvip.com", "nettruyenmoi.com");
    url = url.replace("nettruyenpro.com", "nettruyenmoi.com");
    url = url.replace("nettruyengo.com", "nettruyenmoi.com");
    url = url.replace("nettruyenmoi.com", "nettruyenone.com");
    url = url.replace("nettruyenone.com", "nettruyenco.com");
    var doc = Http.get(url).html();

     var el = doc.select("div.list-chapter li.row .chapter a")
    const data = [];
    for (var i = el.size() - 1; i >= 0 ; i--) {
        var e = el.get(i);
        data.push({
            name: e.text(),
            url: e.attr("href"),
            host: "http://www.nettruyenco.com"
        })
    }

    return Response.success(data);
}