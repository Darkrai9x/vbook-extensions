function execute(url) {
    url = url.replace("nettruyen.com", "nettruyentop.com");
    var doc = Http.get(url).html();

     var el = doc.select("div.list-chapter li.row .chapter a")
    const data = [];
    for (var i = el.size() - 1; i >= 0 ; i--) {
        var e = el.get(i);
        data.push({
            name: e.text(),
            url: e.attr("href"),
            host: "http://www.nettruyentop.com"
        })
    }

    return Response.success(data);
}