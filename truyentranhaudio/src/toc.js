function execute(url) {
    var doc = Http.get(url).html();

    var el = doc.select(".listing-chapters_wrap li a")
    const data = [];
    for (var i = el.size() - 1; i >= 0; i--) {
        var e = el.get(i);
        data.push({
            name: e.text(),
            url: e.attr("href"),
            host: "https://truyentranhaudio.online"
        })
    }

    return Response.success(data);
}