load("config.js");
function execute(url, page) {
    if (!page) page = '1';
    const doc = fetch(DESKTOP_URL + "/" + url + "-" + page + ".html").html();

    let next = doc.select("#page").select(".CurrentPage + a").text()

    const el = doc.select(".content > .list-item")

    const data = [];
    for (let i = 0; i < el.size(); i++) {
        let e = el.get(i);
        let coverImg = e.select("img").first().attr("src");
        if (coverImg.startsWith("//")) {
            coverImg = "https:" + coverImg;
        }
        data.push({
            name: e.select(".book-info > h3").first().text(),
            link: e.select(".book-info a").first().attr("href"),
            cover: coverImg,
            description: e.select("dl > .book-item").get(1).text(),
            host: DESKTOP_URL
        })
    }

    return Response.success(data, next)
}