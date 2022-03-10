load('bypass.js');

function execute(url) {
    url = url.replace("truyenqq.com", "truyenqq.net");
    url = url.replace("truyenqq.net", "truyenqqtop.com");
    url = url.replace("truyenqqtop.com", "truyenqqvip.com");
    url = url.replace("truyenqqvip.com", "truyenqqpro.com");
    var doc = bypass(url, Http.get(url).html());
    if (doc) {
        return Response.success({
            name: doc.select("h1[itemprop=name]").text(),
            cover: doc.select(".book_avatar img").first().attr("src"),
            host: "http://truyenqqpro.com",
            author: doc.select("a.org").text(),
            description: doc.select("div.story-detail-info").html(),
            detail: doc.select(".book_info div.txt").first().html(),
            ongoing: doc.select(".book_info div.txt").html().indexOf("Đang Cập Nhật") >= 0
        });
    }

    return null;
}