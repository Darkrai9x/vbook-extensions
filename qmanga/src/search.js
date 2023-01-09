function execute(key, page) {
    load('config.js');
    if (!page) page = '1';
    const doc = Http.get( BASE_URL + "/tim-kiem").params({"q": key, "page": page}).html();

    var next = doc.select(".pagination").select("li.active + li").text()

    const el = doc.select(".content-tab li")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        var coverImg = e.select("img").first().attr("data-src")
        if (coverImg.startsWith("//")) {
            coverImg = "https:" + coverImg
        }
        data.push({
            name: e.select("h3.title-commic-tab").first().text(),
            link: e.select("a").first().attr("href"),
            cover: coverImg,
            description: e.select(".chapter-commic-tab").first().text(),
            host: BASE_URL
        })
    }

    return Response.success(data, next)
}