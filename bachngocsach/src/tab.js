load('host.js');
function execute(url, page) {
    if (!page) page = '0';

    let response = fetch(url + "/?page=" + page);
    if (response.ok) {
        let doc = response.html();
        let next = doc.select(".pager-next").last().select("a").attr("href").match(/page=(\d+)/);
        if (next) next = next[1];

        let novelList = [];
        doc.select("ul.content-grid > li > div").forEach(e => novelList.push({
            name: e.select("div.recent-truyen a").text(),
            link: e.select("div.recent-truyen a").attr("href"),
            cover: e.select("div.recent-anhbia img").attr("src"),
            description: e.select("div.recent-chuong a").text(),
            host: HOST
        }));
        return Response.success(novelList, next);
    }
    return null;
}