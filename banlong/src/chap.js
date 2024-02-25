function execute(url) {

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        if (doc.select("#chapter-content .content-lock").text().length > 10) {
            return Response.error("Bạn cần trả phí chương này để có thể đọc.")
        }

        return Response.success(doc.select("#nx-chapter-content .s-content"));
    }
    return null;
}