function execute(url) {
    url = url.replace("truyentr.vn", "truyentr.org").replace("truyentr.info", "truyentr.org");
    var doc = Http.get(url).html();
    if (doc) {
        return Response.success({
            name: doc.select("h1.title").text(),
            cover: doc.select("div.book-thumb img").attr("src"),
            host: "http://truyentr.org",
            author: doc.select(".book-info > .content1 > .info a").first().text(),
            description: doc.select("div.book-desc").html(),
            detail: doc.select(".book-info > .content1 > .info"),
            ongoing: doc.select("div.info").html().indexOf(">Đang ra<") > 0
        });
    }
    return null;
}