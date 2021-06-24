function execute(url) {
    var js = Http.get(url).string();
    if (js) {
        Console.log(js)
        js = JSON.parse(js);
        var doc = Html.parse(js.chap_list);
        var el = doc.select(".list-chapter li a");
        var list = [];
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            list.push({
                name: e.text(),
                url: e.attr("href"),
                host: "http://truyenfull.vn"
            });
        }
        return Response.success(list);
    }
    return null;
}