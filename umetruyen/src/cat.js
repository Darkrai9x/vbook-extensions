function execute(url, page) {
    if (!page) {
        page = "1";
    }
    load('config.js');
    let response = fetch(BASE_URL + "?page=" + page);

    if (response.ok) {
        let doc = response.html();
        let next = doc.select(".pager").select("li.active + li").text();

        let novelList = [];
        doc.select(".manga-content .page-item-detail").forEach(e => {
            let cover = e.select("img").first().attr("data-src");
            if (!cover) cover = e.select("img").first().attr("src");
            novelList.push({
                name: e.select("h3 a").first().text(),
                link: e.select("h3 a").first().attr("href"),
                cover: cover,
                description: e.select(".chapter").first().text(),
                host: BASE_URL
            });
        })
        return Response.success(novelList, next)
    }

    return null;
}