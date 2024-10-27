load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();

        let info = doc.select(".book__detail-container");
        info.select(".book__detail-name > div").remove();
        let detail = "";
        info.select(".book__detail-text").forEach(e => {
            detail += e.text() + "<br>";
        });
        return Response.success({
            name: info.select(".book__detail-name").text(),
            cover: info.select("img").first().attr("src"),
            author: info.select(".book__detail-text a").first().text(),
            description: doc.select("#home").html(),
            detail: detail,
            ongoing: info.html().indexOf("Truyện Full") === -1,
            host: BASE_URL,
            type: doc.select(".breadcrumb__container").html().indexOf("truyen-tranh") > 0 ? "comic" : "novel"
        });
    }
    return null;
}