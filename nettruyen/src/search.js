function execute(key, page) {
    if (!page) page = '1';
    const doc = Http.get("https://www.nettruyenking.com/tim-truyen").params({"keyword": key, "page": page}).html();

    var next = doc.select(".pagination").select("li.active + li").text()

    const el = doc.select(".items .item")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        var coverImg = e.select(".image img").first().attr("data-original")
        if (coverImg.startsWith("//")) {
            coverImg = "https:" + coverImg
        }
        data.push({
            name: e.select("h3 a").first().text(),
            link: e.select("h3 a").first().attr("href"),
            cover: coverImg,
            description: e.select(".chapter a").first().text(),
            host: "https://www.nettruyenking.com"
        })
    }

    return Response.success(data, next)
}
