load('config.js');
function execute(url, page) {
    if (!page) page = '1';
    let response = fetch(url, {
        method: "GET",
        queries: {
            page : page
        }
    });
    if (response.ok) {
        let doc = response.html();
        let comiclist = [];
        let next = doc.select(".pager").select('li.active + li').text();
        doc.select(".page-item-detail").forEach(e => {
            comiclist.push({
                name: e.select("h3 a").text(),
                link: e.select("h3 a").attr("href"),
                cover: e.select("img.img-responsive").attr("data-src") || e.select("img.img-responsive").attr("src"),
                description: e.select('.chapter').first().text(),
                host: BASE_URL
            });
        });
        return Response.success(comiclist, next);
    }
    return null;
}