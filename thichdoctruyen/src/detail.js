function execute(url) {
    var doc = Http.get(url).html();

    if (doc) {
        return Response.success({
            name: doc.select("h1.h1truyen").text(),
            cover: doc.select("div.book img[itemprop=image]").attr("src"),
            host: "https://thichdoctruyen.com",
            author: doc.select("a[itemprop=author]").text(),
            description: doc.select("div#viewtomtat2").html(),
            detail: doc.select("div#thongtintruyen1 .truyenp1").html(),
            ongoing: doc.select(".truyenp1").html().indexOf(" Còn Tiếp...") >= 0
        });
    }

    return null;
}
