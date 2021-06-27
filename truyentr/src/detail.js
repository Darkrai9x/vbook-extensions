function execute(url) {
    var doc = Http.get(url).html();
    if (doc) {
        var info = doc.select("div.info > div");
        var detail = "";
        if (info) {
            for (var i = 0; i < info.size(); i++) {
                detail += info.get(i).text().trim() + "<br>";
            }
        }
        return Response.success({
            name: doc.select("h3.title").text(),
            cover: doc.select("div.book img").attr("src"),
            host: "http://truyentr.vn",
            author: doc.select("div.info div a").first().text(),
            description: doc.select("div.desc-text").html(),
            detail: detail,
            ongoing: doc.select("div.info").html().indexOf(">Đang ra<") > 0
        });
    }
    return null;
}