function execute(url) {
    var list = [];
    var doc = Http.get(url).html();
    if(doc) {
        var name = "- " + doc.select("h1.page-title").text() + " - ";
        Console.log(name)
        var el = doc.select("div.book-nav option");
        for (var i = 2; i< el.size(); i++) {
            var e = el.get(i);
            list.push({
                name: e.text().replace(new RegExp(name), ""),
                url: e.attr("value").match(/(http.*?)$/)[1],
                host: "https://gacsach.com",
            });
        }
        return Response.success(list);
    }

    return null;
}