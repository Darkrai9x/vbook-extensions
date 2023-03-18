load('config.js');
function execute(url, page) {
    if (!page) page = 1
    let browser = Engine.newBrowser();
    browser.launchAsync(url + "/page/" + page);
    let retry = 0;
    let doc;
    while (retry < 5) {
        sleep(1000);
        doc = browser.html();
        retry++;
        if (doc.select(".comics-grid .entry").size() > 0) break;
    }
    browser.close();
    if (doc) {
        let next = doc.select(".z-pagination").select(".next").select("a").attr("href").match(/page\/(\d+)/);
        if (next) next = next[1];

        const data = [];
        doc.select(".comics-grid .entry").forEach(e => {
            data.push({
                name: e.select(".name a").first().text(),
                link: e.select(".name a").first().attr("href"),
                cover: e.select("img").first().attr("data-src"),
                description: e.select("h4 a").text(),
                host: BASE_URL
            });
        });
        return Response.success(data, next);
    }
    return null
}