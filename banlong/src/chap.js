function execute(url) {

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        if (doc.select("#chapter-content .content-lock").text().length > 10) {
            return Response.error("Bạn cần trả phí chương này để có thể đọc.")
        }

        return Response.success(doc.select("#chapter-content .s-content").html());
    }
    return null;
}