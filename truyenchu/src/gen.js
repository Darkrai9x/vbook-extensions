load('config.js');
function execute(url, page) {
    if (!page) page = '1';

    let response = fetch(url + "?page=" + page);
    if (response.ok) {
        let doc = response.html();
        var novelList = [];
        var next = doc.select(".pagination > li.active + li").last().text();
        doc.select(".list-truyen div[itemscope]").forEach(e => {
            novelList.push({
                name: e.select(".truyen-title > a").text(),
                link: e.select(".truyen-title > a").first().attr("href"),
                description: e.select(".author").text(),
                cover: e.select("[data-classname=cover]").attr("data-image"),
                host: BASE_URL,
            });
        });
        return Response.success(novelList, next);
    }
    return null;
}