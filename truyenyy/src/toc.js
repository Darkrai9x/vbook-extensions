function execute(url) {
    url = url.replace("truyenyy.com", "truyenyy.vip")
        .replace("truyenyy.vn", "truyenyy.vip");

    var doc = Http.get(url).html();
    if (doc) {
        var list = [];
        var el = doc.select("tbody tr");
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            var ch = e.select("td").first().text();
            ch = ch + ". " + e.select("td").get(1).text();
            list.push({
                name: ch,
                url: e.select("a").first().attr("href"),
                host: "https://truyenyy.vip",
            });
        }
        return Response.success(list)
    }

    return null;
}