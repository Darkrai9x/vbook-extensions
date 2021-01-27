function execute(url) {
    var doc = Http.get(url).html();
    doc.select(".ad_content").remove();
    return Response.success(doc.select("#contentbox"));
}