load('bypass.js');

function execute(url) {
    var doc = bypass(url, Http.get(url).html());
    if (doc) {
        return Response.success({
            name: doc.select("h1[itemprop=name]").text(),
            cover: doc.select(".block01 img").first().attr("src"),
            host: "http://truyenqq.com",
            author: doc.select("a.org").text(),
            description: doc.select("div.story-detail-info").html(),
            detail: doc.select(".block01 div.txt").first().html(),
            ongoing: doc.select("div.block01").html().indexOf("Đang Cập Nhật") >= 0
        });
    }

    return null;
}