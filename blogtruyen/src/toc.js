function execute(url) {
    var doc = Http.get(url).html();
    if (doc) {
        var list = [];
        var name = doc.select("title").text().replace(/\s*\|\s*BlogTruyen.Com/, "");
        var el = doc.select("#list-chapters .title a");
        for (var i = el.size() - 1; i >= 0; i--) {
            var e = el.get(i);
            list.push({
                name: e.text().replace(new RegExp("^" + name + " "), ""),
                url: e.attr("href"),
                host: "https://blogtruyen.vn"
            });
        }
        return Response.success(list)
    }
    return null;
}