load('host.js');

function execute(key, page) {
    if (!page) page = '0';
    let response = fetch(HOST + "/reader/search?ten=" + key + "&page=" + page);
    if (response.ok) {
        let doc = response.html();
        let next = doc.select(".pager-next").last().select("a").attr("href").match(/page=(\d+)/);
        if (next) next = next[1];

        let novelList = [];
        doc.select("div.view-content li.search-row").forEach(e => novelList.push({
            name: e.select("div.search-truyen a").text(),
            link: e.select("div.search-truyen a").attr("href"),
            cover: e.select("div.search-anhbia img").attr("src"),
            description: e.select("div.search-tacgia a").text(),
            host: HOST
        }));

        return Response.success(novelList, next);
    }
    return null;
}
