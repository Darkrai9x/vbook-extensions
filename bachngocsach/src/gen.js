load('host.js');
function execute(url, page) {
    if (!page) page = '0';
    let response = fetch(url + "/?page=" + page);
    if (response.ok) {
        let doc = response.html();

        let next = doc.select(".pager-next").last().select("a").attr("href").match(/page=(\d+)/);
        if (next) next = next[1];

        let novelList = [];
        doc.select(".view-content .term-row").forEach(e => {
            novelList.push({
                name: e.select("a.term-truyen-a").text(),
                link: e.select("a.term-truyen-a").attr("href"),
                cover: e.select(".term-anhbia-a > img").attr("src"),
                description: e.select(".term-tacgia").text(),
                host: HOST
            });
        });

        return Response.success(novelList, next);
    }
    return null;
}