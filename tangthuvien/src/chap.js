function execute(url) {
    var htm = Http.get(url).string();
    if (htm) {
        var doc = Html.parse(htm.replace(new RegExp('\r?\n','g'), "<br />"));
        if (doc) {
            return Response.success(doc.select("div.box-chap").first().html());
        }
    }
    return null;
}