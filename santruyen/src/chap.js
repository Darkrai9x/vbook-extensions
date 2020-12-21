function execute(url) {
    var doc = Http.get(url).html();
    return Response.success(doc.select("div.chapterContent").html());
}