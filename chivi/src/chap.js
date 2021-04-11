function execute(url) {
    var doc = Http.get(url).html();
    doc.select("h1").remove();
    return Response.success(doc.select("article").html());
}