function execute(url) {
    var doc = Http.get(url).html();

    if (doc) {
        const chapList = [];
        var el = doc.select(".chlist").last().select(".list > li > a")

        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            chapList.push({
                "name": e.select(".title").text(),
                "url": e.attr("href"),
                "host": "https://chivi.xyz"

            });
        }
        return Response.success(chapList);
    }

    return null;
}