function execute(url) {
    var doc = Http.get(url).html();
    if (doc) {
        return Response.success({
            name: doc.select("h1").text(),
            cover: doc.select("div.book-img img").attr("src"),
            author: doc.select("div.book-information div.book-info a").first().text(),
            description: doc.select("div.book-info-detail div.book-intro").html(),
            detail: doc.select("p.tag").html().replace(/(<\/[a-z]+>)/, "$1<br>"),
            host: "https://truyen.tangthuvien.vn",
            ongoing: doc.select("p.tag").html().indexOf(">Đang ra<") >= 0
        });
    }
    return null;
}