function execute(url) {
    var doc = Http.get(url).html();

    var el = doc.select(".comic-intro table a");
    var name = doc.select(".info-title").text();
    const data = [];
    for (var i = el.size() - 1; i >= 0; i--) {
        var e = el.get(i);
        data.push({
            name: e.select("span").first().text().replace(name + ' – ', ''),
            url: e.attr("href"),
            host: "https://www.ngonphong.com"
        });
    }

    return Response.success(data);
}