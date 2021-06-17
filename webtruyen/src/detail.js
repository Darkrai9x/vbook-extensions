function execute(url) {
    url = url.replace("webtruyen.com", "dtruyen.com");
    var doc = Http.get(url).html().select("#story-detail");

    return Response.success({
        name: doc.select("h1.title").first().text(),
        cover: doc.select(".thumb img").first().attr("src"),
        author: doc.select("a[itemprop=author]").text(),
        description: doc.select(".description").html(),
        detail: doc.select(".infos").html(),
        host: "https://dtruyen.com",
        ongoing: doc.select(".infos").html().indexOf("Đang cập nhật") >= 0
    });
}