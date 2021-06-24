function execute(url) {
    var doc = Http.get(url).html();
    if (doc) {
        doc.select(".note-reg").remove();
        return Response.success(doc.select("div#chapter-content").html());
    }
    return null;
}