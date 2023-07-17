load("config.js");
function execute(key, page) {
    if (!page) page = '1';
    let response = fetch(BASE_URL + "/ket-qua-tim-kiem", {
        method: "GET",
        queries: {
            term: key,
            page: page
        }
    });
    if (response.ok) {
        let doc = response.html();
        let novelList = [];
        let next = doc.select("ul.pagination > li > a").last().attr("href").match(/page=(\d+)/);
        if (next) next = next[1]; else next = '';
        doc.select("#rank-view-list ul li").forEach(e => {
            novelList.push({
                name: e.select("h4 > a").text(),
                link: e.select("h4 > a").attr("href"),
                description: e.select(".author").text(),
                cover: e.select("img").first().attr("src"),
                host: BASE_URL
            });
        });

        return Response.success(novelList, next);
    }

    return null;
}
