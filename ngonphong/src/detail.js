function execute(url) {
    const doc = Http.get(url).html()

    const cate = doc.select(".comic-info > .tags > a")
    const category = [];
    for (var i = 0; i < cate.size(); i++) {
        var e = cate.get(i)
        category.push({
            name: e.text(),
            link: e.attr("href")
        })
    }

    var authorRegex = /Tác giả:\s*(.*?)\s*Nhóm dịch/;
    var authorName = doc.select("#cate-rating + p").text().match(authorRegex);

    if (authorName) {
        authorName = authorName[1];
    } else {
        authorName = ""
    }

    return Response.success({
        name: doc.select(".info-title").text(),
        cover: doc.select("img.img-thumbnail").first().attr("src"),
        author: authorName,
        description: doc.select(".intro-container > p").html(),
        detail: doc.select("#cate-rating + p").html(),
        category: category,
        host: "https://beeng.net"
    });
}