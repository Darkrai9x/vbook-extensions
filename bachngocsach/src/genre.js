function execute() {

    var doc = Http.get("https://bachngocsach.com/reader/theloai").html();

    var genre = [];
    if (doc) {
        var el = doc.select("div.view-content .theloai-row a");

        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            genre.push({
                title: e.text(),
                input: "https://bachngocsach.com" + e.attr("href"),
                script: "gen.js"
            });
        }
        return Response.success(genre);
    }

    return null;
}