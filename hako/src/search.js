load('config.js');

function execute(key, page) {
    if (!page) page = '1';

    let response = fetch(BASE_URL+"/tim-kiem", {
        method: "GET",
        queries: {
            keywords: key,
            page: page
        }
    });
    if (response.ok) {
        let doc = response.html();
        let next = doc.select(".pagination-footer a.current + a").text()
        let novelList = [];
        doc.select(".sect-body .thumb-item-flow").forEach(e => {
            novelList.push({
                name: e.select(".series-title a").text(),
                link: e.select(".series-title a").attr("href"),
                description: e.select(".chapter-title").text(),
                cover: e.select(".img-in-ratio").attr("data-bg"),
                host: BASE_URL
            });
        });

        return Response.success(novelList, next);
    }
    return null;
}
