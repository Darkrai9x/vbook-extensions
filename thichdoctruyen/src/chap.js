function execute(url) {
    var doc = Http.get(url).html();
    if (doc) {
        var htm = doc.select("div.boxview").html();
        if (htm.length < 2000 && htm.indexOf("login/login") > 0) return null;
        return Response.success(htm.replace("&nbsp;", ""));
    }
    return null;
}