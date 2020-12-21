function execute(url, page) {
    var doc;
    if (!page) {
       doc = Http.get(url).html()
    } else {
        doc = Http.get("https://umetruyen.com/" +page).html()
    }


    var next = doc.select(".pagination").select("li:has(a.active) + li").select("a").attr("href")

    const el = doc.select(".items .media")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        var coverImg = e.select("img").first().attr("src")
        if (coverImg.startsWith("//")) {
            coverImg = "https:" + coverImg
        }
        data.push({
            name: e.select(".content-title").first().text(),
            link: e.select("a.content-title").first().attr("href"),
            cover: coverImg,
            description: e.select(".last-chap").first().text(),
            host: "https://umetruyen.com"
        })
    }

    return Response.success(data, next)
}