function execute(url) {
    var doc = Http.get(url).html();
    doc.select("iframe,ins").remove();
    return Response.success(doc.select("div.content.container1").html());
}