function execute(url) {
    if (url.indexOf("sj.uukanshu.com") === -1) {
        var bookId = url.match(/\/b\/(\d+)\/?$/)[1];
        url = "https://sj.uukanshu.com/book.aspx?id=" + bookId;
    }
    var doc = Http.get(url).html();
    if (doc) {
        var info = doc.select(".book-info");
        var coverImg = info.select(".pic img").first().attr("src");
        if (coverImg.startsWith("//")) {
            coverImg = "https:" + coverImg;
        }
        return Response.success({
            name: info.select("h1.bookname").text(),
            cover: coverImg,
            author: info.select("dd").first().text().replace("作者：", ""),
            description: info.select(".desc").text(),
            detail: info.select("dd").html(),
            host: "https://sj.uukanshu.com"
        });
    }

    return null;

}