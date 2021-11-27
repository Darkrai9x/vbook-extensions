function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        doc.select(".note-reg").remove();
        return Response.success(doc.select("div#chapter-content").html());
    }
    return null;
}