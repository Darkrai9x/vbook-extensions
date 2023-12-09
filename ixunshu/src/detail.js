load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let detail = "";
        doc.select("#info > p").forEach(e => {
            detail += e.text() + "<br>"
        });
        return Response.success({
            name: doc.select("#info h1").text(),
            cover: doc.select("#fmimg > img").attr("data-original"),
            author: doc.select("#info > p").first().text().replace("作者：", ""),
            description: doc.select("#intro").html(),
            detail: detail,
            host: BASE_URL
        });
    }
    return null;
}