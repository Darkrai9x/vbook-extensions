load('config.js');

function execute(url, page) {
    if (!page) page = '1';

    let response = fetch(url, {
        queries: {
            page: page,
        }
    });
    if (response.ok) {
        let doc = response.html();
        let novelList = [];
        let next = doc.select("[aria-current=page] + a").attr("href").match(/page=(\d+)/);
        if (next) next = next[1];
        doc.select("div[itemscope]").forEach(e => {
            novelList.push({
                name: e.select("a[itemProp=url]").first().text(),
                link: e.select("a[itemProp=url]").first().attr("href"),
                description: e.select(".items-center").last().text(),
                cover: e.select("img[loading]").first().attr("src"),
                host: BASE_URL,
            });
        });
        return Response.success(novelList, next);
    }
    return null;
}