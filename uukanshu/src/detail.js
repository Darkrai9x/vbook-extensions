load("config.js");

function execute(url) {
    url = url.replace("#gsc.tab=0", "")
    if (url.indexOf("sj.") === -1) {
        let bookId = url.match(/\/b\/(\d+)\/?$/)[1];
        url = MOBILE_URL + "/book.aspx?id=" + bookId;
    }
    let doc = fetch(url).html();
    if (doc) {
        let info = doc.select(".book-info");
        let coverImg = info.select(".pic img").first().attr("src");
        if (coverImg.startsWith("//")) {
            coverImg = "https:" + coverImg;
        }
        return Response.success({
            name: info.select("h1.bookname").text(),
            cover: coverImg,
            author: info.select("dd").first().text().replace("作者：", ""),
            description: info.select(".desc").text(),
            detail: info.select("dd").html(),
            host: MOBILE_URL,
            url: url,
        });
    }

    return null;

}