load('config.js');
function execute(url, page) {
    if (!page) page = '0';

    let response = fetch(url + "?page=" + page);
    if (response.ok) {
        let doc = response.html();
        let novelList = [];
        let next = doc.select(".pager li.pager-current + li").last().select("a").attr("href").match(/page=(\d+)/);
        if (next) next = next[1]; else next = '';
        doc.select(".view-content tbody tr").forEach(e => {
            novelList.push({
                name: e.select(".tvtitle a").text(),
                link: e.select(".tvtitle a").attr("href"),
                cover: e.select(".tvanh img").attr("src"),
                description: e.select(".tvauthor").text(),
                host: BASE_URL
            });
        });

        return Response.success(novelList, next);
    }
    return null;
}