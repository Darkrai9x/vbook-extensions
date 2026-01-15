load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        doc.select("div.booktitle").remove();
        return Response.success({
            name: doc.select("h1.page-title").text(),
            cover: doc.select("div.detailsach img").attr("src"),
            host: BASE_URL,
            author: doc.select("div.field-name-field-author a").first().text(),
            description: doc.select("div.field-item[property='content:encoded']").html(),
            detail: "<b>Mục sách:</b> " + doc.select("div.field-name-field-mucsach .field-items").text() + "<br><b>Tình trạng:</b> " + doc.select("div.field-name-field-status .field-items").text() + "<br><b>Từ khóa:</b> " + doc.select("div.field-name-field-tag .field-items").text(),
            ongoing: doc.select(".field-name-field-status").text().indexOf("Đang ra") >= 0
        });
    }
    return null;
}
