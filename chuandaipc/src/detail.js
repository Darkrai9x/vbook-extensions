load("config.js");
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url + "/");
    if (response.ok) {

        let doc = response.html();
        let coverImg = doc.select(".am-thumbnail").first().attr("src");
        if (coverImg.startsWith("//")) {
            coverImg = "https:" + coverImg;
        }
        let info = doc.select(".book-info-book");
        return Response.success({
            name: info.select("h1").text(),
            cover: coverImg,
            author: info.select("a[href*=author]").text(),
            description: info.select("#bookintro").text(),
            detail: info.select("h2.am-text-sm").html(),
            ongoing: info.select("h2").html().indexOf("连载") >= 0
        });
    }
    return null;
}