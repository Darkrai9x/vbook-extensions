function execute(url) {
    var request = Http.get(url)
    var doc = request.html();
    var newUrl = request.url();

    if (doc) {
        if (newUrl.indexOf("metruyenchu.com") > 0) {
            return loadNewWeb(newUrl, "https://metruyenchu.com", doc);
        } else if (newUrl.indexOf("nuhiep.com") > 0) {
            return loadNewWeb(newUrl, "https://nuhiep.com", doc);
        } else if (newUrl.indexOf("vtruyen.com") > 0) {
            return loadNewWeb(newUrl, "https://vtruyen.com", doc);
        }
        return loadOldWeb(newUrl, doc);
    }

    return null;
}

function loadNewWeb(newUrl,host, doc) {
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
            host: host,
            author: author,
            url: newUrl,
            description: doc.select("div#nav-intro .content").html(),
            detail: detail,
            ongoing: detail.indexOf("Đang ra") >= 0
        }
    );
}

function loadOldWeb(newUrl, doc) {
    var el = doc.select("div.info div.list div.item");
    for (var i = 0; i < el.size(); i++) {
        detail += el.get(i).text() + "<br>";
    }
    return Response.success({
        name: doc.select("h1.title").text(),
        cover: doc.select("div.thumb img.img-responsive").attr("src"),
        host: "https://truyencv.com",
        author: doc.select("div.info div.item a").first().text(),
        description: doc.select("div.brief").html(),
        detail: detail,
        url: newUrl,
        ongoing: detail.indexOf("Đang ra") > 0
    });
}