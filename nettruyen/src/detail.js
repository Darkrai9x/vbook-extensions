load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let coverImg = doc.select(".detail-info img").first().attr("src");
        if (coverImg.startsWith("//")) {
            coverImg = "https:" + coverImg;
        }
        return Response.success({
            name: doc.select("h1.title-detail").first().text(),
            cover: coverImg,
            author: doc.select(".author a").first().text(),
            description: doc.select(".detail-content p").html(),
            detail: doc.select(".list-info").html(),
            host: BASE_URL,
            ongoing: doc.select(".detail-info .status").html().indexOf("Đang tiến hành") >= 0
        });
    }

    return null;
}