function execute(url) {
    var doc = Http.get(url).html();

    var title = doc.select("div.list-chap .col-xs-12")
    if (title.size() === 2) {
        doc.select("div.list-chap .col-sm-6").first().remove();
    }
    var el = doc.select("div.list-chap ul li a")
    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.text(),
            url: e.attr("href"),
            host: "http://sstruyen.com"
        })
    }

    return Response.success(data);
}