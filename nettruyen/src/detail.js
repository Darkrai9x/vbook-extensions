function execute(url) {
    url = url.replace("nettruyen.com", "nettruyenvip.com");
    url = url.replace("nettruyentop.com", "nettruyenvip.com");
    url = url.replace("nettruyenvip.com", "nettruyenpro.com");
    const doc = Http.get(url).html()
    var coverImg = doc.select(".detail-info img").first().attr("src");
    if (coverImg.startsWith("//")) {
        coverImg = "https:" + coverImg
    }
    return Response.success({
        name: doc.select("h1.title-detail").first().text(),
        cover: coverImg,
        author: doc.select(".author a").first().text(),
        description: doc.select(".detail-content p").html(),
        detail: doc.select(".list-info").html(),
        host: "http://www.nettruyenpro.com",
        ongoing: doc.select(".detail-info .status").html().indexOf("Đang tiến hành") >= 0
    });
}