load('config.js');

function execute(url, page) {
    if (!page) page = '1';

    var response = fetch(BASE_URL + url + "?page=" + page);

    if (response.ok) {
        let doc = response.html();
        let novelList = [];
        var next = doc.select(".pagination > li.active + li").last().text();
        doc.select(".list-stores > .item").forEach(e => {
            novelList.push({
                name: e.select(".store-title > a").text(),
                link: e.select(".store-title > a").first().attr("href"),
                description: e.select(".author").text(),
                cover: e.select("img").first().attr("data-src").replace("180/90", "217/300"),
                host: BASE_URL,
            });
        });
        return Response.success(novelList, next);
    }
    return null;
}