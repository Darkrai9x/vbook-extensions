function execute(url, page) {
    if (!page) page = '1';
    const doc = Http.get(url + "/page/" + page + "/").html()

    var next = doc.select(".nav-previous a").attr("href").match(/page\/(\d+)/)

    if (next) next = next[1]

    const el = doc.select(".page-content-listing .page-item-detail")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.select(".post-title a").first().text(),
            link: e.select(".post-title a").first().attr("href"),
            cover: e.select(".item-thumb img").first().attr("src"),
            description: e.select(".chapter-item .chapter").text(),
            host: "https://truyentranhaudio.online"
        })
    }

    return Response.success(data, next)
}