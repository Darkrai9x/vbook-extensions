load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        doc.select("div.booktitle").remove();
        return Response.success({
            name: doc.select("h1.page-title").text(),
            cover: doc.select("div.imagesach img").attr("src"),
            host: BASE_URL,
            author: doc.select("div.field-name-field-author a").first().text(),
            description: doc.select("div.field-type-text-with-summary").html(),
            detail: doc.select(".field-sach .field").html(),
            ongoing: doc.select(".field-name-field-status").html().indexOf("Đang ra") >= 0
        });
    }
    return null;
}
