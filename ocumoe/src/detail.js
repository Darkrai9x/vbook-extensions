load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (!response.ok) return null;
    let doc = response.html()

    let cate = doc.select(".comic-info > .tags > a")
    let category = [];
    for (var i = 0; i < cate.size(); i++) {
        var e = cate.get(i)
        category.push({
            name: e.text(),
            link: e.attr("href")
        })
    }

    let authorRegex = /Tác giả:\s*(.*?)\s*Nhóm dịch/;
    let authorName = doc.select("#cate-rating + p").text().match(authorRegex);

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
        host: BASE_URL
    });
}