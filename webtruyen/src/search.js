function execute(key, page) {
    if (!page) page = '1';
    var doc = Http.get("https://dtruyen.com/searching/" + key.replace(" ", "-") + "/lastupdate/all/all/" + page).html();

    var next = doc.select(".pagination").select("li:has(.active) + li").select("a").text();

    var el = doc.select(".list-content .list-row-img");
    var data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.select(".row-info a").first().text(),
            link: e.select(".row-info a").first().attr("href"),
            cover: e.select(".row-image img").first().attr("src"),
            description: e.select(".row-author").text(),
            host: "https://dtruyen.com"
        })
    }

    return Response.success(data, next);
}