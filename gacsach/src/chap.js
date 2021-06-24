function execute(url) {
    var doc = Http.get(url).html();
    if(doc) {
        var e = doc.select("div.field-item.even");
        e.select("p[style=text-align: center; line-height: 1.1;]").remove();
        return Response.success(e.html());
    }
    return null;
}