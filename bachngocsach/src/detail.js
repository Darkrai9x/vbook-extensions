function execute(url) {
    var doc = Http.get(url).html();
    if (doc) {
        return Response.success({
            name: doc.select("h1#truyen-title").text(),
            cover: doc.select("div#anhbia img").attr("src"),
            host: "http://bachngocsach.com",
            author: doc.select("div#tacgia a").text(),
            description: doc.select("div#gioithieu").html(),
            detail: doc.select("div#tacgia").html() + "<br>" + doc.select("div#theloai").html()
        });
    }
    return null;
}