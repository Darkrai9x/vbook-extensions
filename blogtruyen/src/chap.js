function execute(url) {

    var doc = Http.get(url).html();

    var imgs = doc.select("article#content img");
    var data = [];
    for (var i = 0; i < imgs.size(); i++) {
        var e = imgs.get(i)
        data.push({
            link: e.attr("src"),
        });
    }
    return Response.success(data);
}