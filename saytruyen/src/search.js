function execute(key, page) {
    if (!page) page = '1';
    var url = 'https://saytruyen.net/danh-sach-truyen.html?status=0&page='+page+'&name='+key+'&sort=last_update'
    const doc = Http.get(url).html();

    var next = doc.select("ul.pager").select("li.active + li").text();

    const el = doc.select("ul#danhsachtruyen > li");

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.select(".info-bottom a").first().text(),
            link: e.select(".info-bottom a").first().attr("href"),
            cover: e.select("a").first().attr("data-src"),
            description: e.select(".info-bottom span").text().replace(/\ :.*/g, ""),
            host: "https://saytruyen.net"
        });
    }

    return Response.success(data, next)
}