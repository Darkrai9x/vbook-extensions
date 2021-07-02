function execute(url) {
    url = url.replace("beeng.net", "beeng.org");
    const doc = Http.get(url).html()

    const cate = doc.select(".list-cate a")
    const category = [];
    for (var i = 0; i < cate.size(); i++) {
        var e = cate.get(i)
        category.push({
            name: e.text(),
            link: e.attr("href")
        })
    }

    return Response.success({
        name: doc.select(".detail h1").text(),
        cover: doc.select(".cover img").first().attr("data-src"),
        author: doc.select(".author a").first().text(),
        description: doc.select(".shortDetail").html(),
        detail: doc.select(".aboutThisComic").html(),
        category: category,
        host: "https://beeng.org"
    });
}