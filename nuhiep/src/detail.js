function execute(url) {
    var doc = Http.get(url).html();
    if (doc) {
        var detailElements = doc.select("div.page-content div.media-body")
        var author = detailElements.select("ul li").first().text();
        var status = detailElements.select("ul li").get(1).text();
        var genreElements = detailElements.select("a[href*=truyen?genre]");
        var detail = author + "<br>";
        var infoElements = detailElements.select(".list-unstyled").get(1).select("li");
        for (var i = 0; i < infoElements.size(); i++) {
            detail += infoElements.get(i).text() + ", ";
        }
        detail += status;
        return Response.success(
            {
                name: doc.select("h1.h3").text(),
                cover: doc.select("div.nh-thumb img").attr("src"),
                host: "https://nuhiep.com",
                author: author,
                description: doc.select("div#nav-intro .content").html(),
                detail: detail,
                ongoing: detail.indexOf("Đang ra") >= 0
            }
        );
    }
    return null;
}
