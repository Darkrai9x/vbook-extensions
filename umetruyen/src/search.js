function execute(key, page) {
    if (!page) {
        page = "1";
    }
    let response = fetch( BASE_URL + "/search?s=" + key + "&page=" + page);
    if (response.ok) {
        let doc = response.html();
        let next = doc.select(".pager").select("li.active + li").text();

        let novelList = [];
        doc.select(".page-item-detail").forEach(e => novelList.push({
            name: e.select("h3 a").first().text(),
            link: e.select("h3 a").first().attr("href"),
            cover: e.select("img").first().attr("src"),
            description: e.select(".chapter").first().text(),
            host: BASE_URL
        }))
        return Response.success(novelList, next)
    }

    return null;
}