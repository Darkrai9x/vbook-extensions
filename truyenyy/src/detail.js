function execute(url) {
    url = url.replace("truyenyy.com", "truyenyy.vip")
        .replace("truyenyy.vn", "truyenyy.vip");
    var doc = Http.get(url).html();
    if (doc) {
        var cover = doc.select("div.novel-info img").attr("src");
        if (!cover) cover = doc.select("div.novel-info img").attr("data-src");
        return Response.success({
            name: doc.select("div.info h1").text(),
            cover: cover,
            host: "http.",
            author: doc.select("div.info .author").text(),
            description: doc.select("section#id_novel_summary").html(),
            detail: doc.select("div.info .author").html(),
            ongoing: doc.select("div.info").html().indexOf("status=F") == -1
        });
    }

    return null;
}