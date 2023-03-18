load('config.js');
function execute(key, page) {
    let browser = Engine.newBrowser();
    browser.launchAsync(BASE_URL + "/danh-sach-truyen?q="  + key);
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
        const data = [];
        doc.select(".comics-grid .entry").forEach(e => {
            data.push({
                name: e.select("h3.name a").first().text(),
                link: e.select("h3.name a").first().attr("href"),
                cover: e.select("img").first().attr("data-src"),
                description: e.select("h4 a").text(),
                host: BASE_URL
            });
        });

        return Response.success(data);
    }

    return null;
}