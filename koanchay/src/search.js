function execute(key, page) {
    if (!page) page = '0';
    const doc = Http.get("https://koanchay.info/tim-kiem?q=" + key + "&qs=1" + "&start=" + page + "&vo=1").html();

    var next = doc.select(".pagination").select("li.active + li").select("a").attr("href").match(/start=(\d+)/)
    if (next) next = next[1]

    const el = doc.select(".book-list > .book-item")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.select(".book-title").text(),
            link: e.select(".info-col > a").first().attr("href"),
            cover: e.select(".cover-col img").attr("src"),
            description: e.select(".book-author").text(),
            host: "https://koanchay.info"
        })
    }

    return Response.success(data, next)
}