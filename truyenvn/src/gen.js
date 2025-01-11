load('config.js');

function execute(url, page) {
    if (!page) page = '1';
    let response = fetch(url + "/page/" + page);
    if (response.ok) {
        let doc = response.html();
        let comiclist = [];
        let next = /page\/(\d+)/.exec(doc.select(".current + a").attr('href'));
        if (next) next = next[1];
        doc.select(".page-item-detail").forEach(e => {
            let cover = e.select("img").first().attr("src")
                || e.select("img").first().attr("data-lazy-src")
                || e.select("img").first().attr("data-src");
            comiclist.push({
                name: e.select("h3 a").text(),
                link: e.select("h3 a").attr("href"),
                cover: cover,
                description: e.select('.chapter').first().text(),
                host: BASE_URL
            });
        });
        return Response.success(comiclist, next);
    }
    return null;
}