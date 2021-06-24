function execute(url) {
    var doc = Http.get(url).html();
    if (doc) {
        doc.select(".title-chap").remove();
        return Response.success(doc.select(".reading").html());
    }
    return null;
}