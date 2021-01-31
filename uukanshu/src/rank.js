function execute(url, page) {
    const doc = Http.get(url).html();

    const el = doc.select(".listc .phright .bookcon")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        var coverImg = e.select("img").first().attr("src");
        if (coverImg.startsWith("//")) {
            coverImg = "https:" + coverImg;
        }
        data.push({
            name: e.select(".bookname").first().text(),
            link: e.select("a").first().attr("href"),
            cover: coverImg,
            description: e.select(".last").first().text(),
            host: "https://www.uukanshu.com"
        })
    }

    return Response.success(data)
}