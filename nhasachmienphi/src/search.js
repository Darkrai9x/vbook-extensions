function execute(key, page) {

    if (!page) {
        page = "1";
    }

    var doc = Http.get("https://nhasachmienphi.com/?s=" + key  ).html();

    const ebookList = [];
    var next = "";

    if (doc) {
        var el = doc.select(".content_page .col-xs-6")
        var nextPage = doc.select(".nextpostslink .col-xs-6").attr("href");

        const pageRegex = /.*p=(\d+)/g;
        const result = pageRegex.exec(nextPage);
        if (result) {
            next = result[1];
        }

        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            ebookList.push({
                "name": e.select("h4.mg-t-10").text(),
                "link": e.select("a").first().attr("href"),
                "cover": e.select("img.medium_thum").first().attr("src"),
                "host": "https://nhasachmienphi.com"
            });
        }
    }

    return Response.success(ebookList, next);
}