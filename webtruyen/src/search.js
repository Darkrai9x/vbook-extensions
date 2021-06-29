function execute(key, page) {
    if (!page) page = '1';
    var doc = Http.get("https://dtruyen.com/searching/" + key.replace(" ", "-") + "/lastupdate/all/all/" + page).html();

     var next = doc.select(".pagination").select("li.active + li").text();

    const el = doc.select(".list-stories .story-list")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.select(".info h3").first().text(),
            link: e.select(".info h3 a").first().attr("href"),
            cover: e.select(".thumb img").first().attr("data-layzr"),
            description: e.select(".last-chapter").first().text(),
            host: "https://dtruyen.com"
        })
    }

    return Response.success(data, next);
}