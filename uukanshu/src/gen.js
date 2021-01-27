function execute(url, page) {
    if (!page) page = '1';
    const doc = Http.get("https://www.uukanshu.com/" + url + "-" + page + ".html").html();

    var next = doc.select("#page").select(".CurrentPage + a").text()

    const el = doc.select(".content > .list-item")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        var coverImg = e.select("img").first().attr("src");
        if (coverImg.startsWith("//")) {
            coverImg = "https:" + coverImg;
        }
        data.push({
            name: e.select(".book-info > h3").first().text(),
            link: e.select(".book-info a").first().attr("href"),
            cover: coverImg,
            description: e.select("dl > .book-item").get(1).text(),
            host: "https://www.uukanshu.com"
        })
    }

    return Response.success(data, next)
}