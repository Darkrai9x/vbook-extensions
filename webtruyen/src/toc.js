function execute(url) {
    url = url.replace("webtruyen.com", "dtruyen.com");
    var doc = Http.get(url).html();

    var el = doc.select("#chapters .chapters a")
    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.text(),
            url: e.attr("href"),
            host: "https://dtruyen.com"
        })
    }

    return Response.success(data);
}