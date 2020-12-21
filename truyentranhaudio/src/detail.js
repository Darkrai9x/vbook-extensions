function execute(url) {
    const doc = Http.get(url).html()

    const cate = doc.select(".genres-content a")
    const category = [];
    for (var i = 0; i < cate.size(); i++) {
        var e = cate.get(i)
        category.push({
            name: e.text(),
            link: e.attr("href")
        })
    }

    return Response.success({
        name: doc.select(".post-title h3").text(),
        cover: doc.select(".summary_image img").first().attr("src"),
        author: doc.select(".author-content a").first().text(),
        description: doc.select(".summary__content").html(),
        detail: doc.select(".post-content .post-content_item").html(),
        category: category,
        ongoing: doc.select(".post-status").html().indexOf("OnGoing") != -1,
        host: "https://truyentranhaudio.online"
    });
}