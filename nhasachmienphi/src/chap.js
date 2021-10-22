function execute(url) {
    var doc = Http.get(url).html();
    var content = doc.select(".content_p").select("p").html();
    return Response.success(content); 
}