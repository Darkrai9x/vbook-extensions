function execute(url) {
    var doc = Http.get(url + "/").html();

    var el = doc.select("#list a")
    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.select("a").text(),
            url: e.attr("href"),
            host: "https://www.biqubu.com"
        })
    }

    return Response.success(data);
}