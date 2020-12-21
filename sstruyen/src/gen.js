function execute(url, page) {
    if (!page) page = '1';
    const doc = Http.get(url + "/trang-" + page).html()

    var next = doc.select(".pagination").select(".next").select("a").attr("href").match(/trang-(\d+)/)
    if (next) next = next[1]

    const el = doc.select(".table-list.pc tr")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.select(".info a").first().text(),
            link: e.select(".info a").first().attr("href"),
            cover: e.select("img").first().attr("src"),
            description: e.select(".chap").text(),
            host: "https://sstruyen.com"
        })
    }

    return Response.success(data, next)
}