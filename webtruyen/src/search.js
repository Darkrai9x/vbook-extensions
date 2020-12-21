function execute(key, page) {
    if (!page) page = '1';
    const doc = Http.get("https://webtruyen.com/searching/" + key.toLowerCase() + "/lastupdate/all/all/" + page).html();

    var next = doc.select(".pagination").select("li:has(.active) + li").select("a").text();

    const el = doc.select(".list-content .list-row-img");
    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.select(".row-info a").first().text(),
            link: e.select(".row-info a").first().attr("href"),
            cover: e.select(".row-image img").first().attr("src"),
            description: e.select(".row-author").text(),
            host: "https://webtruyen.com"
        })
    }

    return Response.success(data, next);
}