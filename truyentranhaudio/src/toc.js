function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, "https://truyentranhaudio.org");
    var doc = Http.get(url).html();

    var el = doc.select(".list_chapter li a")
    const data = [];
    for (var i = el.size() - 1; i >= 0; i--) {
        var e = el.get(i);
        data.push({
            name: e.text(),
            url: e.attr("href"),
            host: "https://truyentranhaudio.org/"
        })
    }

    return Response.success(data);
}