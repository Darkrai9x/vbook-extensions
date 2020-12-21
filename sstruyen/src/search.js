function execute(key, page) {
    if (!page) page = '1';
    const doc = Http.get("https://sstruyen.com/tim-truyen/" + key + "/trang-" + page).html();

    var next = doc.select(".pagination").select(".next").select("a").attr("href").match(/trang-(\d+)/)
    if (next) next = next[1]

    const el = doc.select(".grid-items .inner-item")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.select(".name-book").text(),
            link: e.select("a").first().attr("href"),
            cover: e.select("img").first().attr("src"),
            description: e.select(".rate").text(),
            host: "https://sstruyen.com"
        })
    }

    return Response.success(data, next)
}