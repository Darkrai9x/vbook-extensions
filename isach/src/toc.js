function execute(url) {
    var doc = Http.get(url + "&chapter=0000").html();

    var htm = doc.html();
    var start = htm.indexOf("<div id=\"c0000\"");
    var end = htm.indexOf("<div class=\"navigator_bottom\">", start);

    const data = [];
    if (end <= start) {
        data.push({
            name: "Nội dung",
            url: url,
            host: "https://isach.info"
        })
    } else {
        doc = Html.parse(htm.substr(start, end));
        var el = doc.select("div.right_menu_item a");
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            data.push({
                name: e.text(),
                url: e.attr("href"),
                host: "https://isach.info"
            })
        }
    }

    return Response.success(data);
}