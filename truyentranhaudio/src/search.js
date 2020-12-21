function execute(key, page) {
    if (!page) page = '1';
    const doc = Http.get("https://truyentranhaudio.online/page/" + page + "/?s=" + key + "&post_type=wp-manga").html()

    var next = doc.select(".nav-previous a").attr("href").match(/page\/(\d+)/)

    if (next) next = next[1]

    const el = doc.select(".c-tabs-item .c-tabs-item__content")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.select(".post-title a").first().text(),
            link: e.select(".post-title a").first().attr("href"),
            cover: e.select(".tab-thumb img").first().attr("src"),
            description: e.select(".chapter a").first().text(),
            host: "https://truyentranhaudio.online"
        })
    }

    return Response.success(data, next)
}