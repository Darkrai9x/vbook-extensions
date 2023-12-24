load("config.js");

function execute(url, page) {
    const doc = fetch(DESKTOP_URL + url).html();
    const data = [];
    doc.select(".listc .phright .bookcon").forEach(e => {
        let coverImg = e.select("img").first().attr("src");
        if (coverImg.startsWith("//")) {
            coverImg = "https:" + coverImg;
        }
        data.push({
            name: e.select(".bookname").first().text(),
            link: e.select("a").first().attr("href"),
            cover: coverImg,
            description: e.select(".last").first().text(),
            host: DESKTOP_URL
        });
    });

    return Response.success(data)
}