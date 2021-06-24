function execute(url) {
    var doc = Http.get(url).html();
    if (doc) {
        var id = doc.select("input[name=story_id]").attr("value");
        doc = Http.get("https://truyen.tangthuvien.vn/story/chapters?story_id=" + id).html();
        if (doc) {
            var list = [];
            var el = doc.select("li a");
            for (var i = 0; i < el.size(); i++) {
                var e = el.get(i)
                list.push({
                    name: e.text(),
                    url: e.attr("href"),
                    host: "http://truyen.tangthuvien.vn"
                });
            }
            return Response.success(list);
        }
    }
    return null;
}