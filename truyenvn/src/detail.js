function execute(url) {
    url = url.replace("truyenvn.com", "truyenvn.tv");
    url = url.replace("truyenvn.tv", "truyenvn.vip");
    url = url.replace("truyenvn.vip", "truyenvnhot.com");
    const doc = Http.get(url).html();

    return Response.success({
        name: doc.select("h1.name").first().text(),
        cover: doc.select(".book img").first().attr("src"),
        author: doc.select(".author a").first().text(),
        description: doc.select(".comic-description").html(),
        detail: doc.select(".meta-data").html(),
        host: "https://truyenvnhot.com",
        ongoing: doc.select(".status").text().indexOf("Đang Cập Nhật") >= 0
    });
}