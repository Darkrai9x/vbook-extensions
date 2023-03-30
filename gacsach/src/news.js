load('config.js');
function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let novelList = [];
        doc.select(".sachmoi .view-content .views-row").forEach(e => {
            novelList.push({
                name: e.select(".smtitle").first().select("a").text(),
                link: e.select(".smimg").first().select("a").attr("href"),
                cover: e.select(".smimg").first().select("a img").attr("src"),
                description: e.select(".smauthor").text(),
                host: BASE_URL
            });
        });
        return Response.success(novelList);
    }
    return null;
}