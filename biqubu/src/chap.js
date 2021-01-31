function execute(url) {
    var doc = Http.get(url).html();
    var htm = doc.select("#content").html();
    htm = htm.replace(/\&nbsp;/g, "");
    return Response.success(htm);
}