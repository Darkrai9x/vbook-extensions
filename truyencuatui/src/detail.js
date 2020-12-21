function execute(url) {
    var doc = Http.get(url).html();


    return Response.success({
        name: doc.select("h1.title").first().text(),
        cover: doc.select(".cover img").first().attr("src"),
        author: doc.select("a[itemprop=author] span").last().text(),
        description: doc.select(".contentt").html(),
        detail: doc.select(".visible-md").html(),
        host: "https://truyencuatui.net",
        url: url.replace("m.truyencuatui.net", "truyencuatui.net"),
        ongoing: doc.select(".stt").html().indexOf("Đang cập nhật") >= 0
    });
}