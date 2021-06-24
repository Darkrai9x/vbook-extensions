function execute(url) {
    var browser = Engine.newBrowser();

    browser.block([".*?api.truyen.onl/v2.*?"]);

    browser.launch(url, 10000);
    browser.callJs("document.getElementById('nav-tab-chap').click();", 500);
    browser.waitUrl(".*?api.truyen.onl/v2.*?", 10000);
    browser.close()

    var urls = JSON.parse(browser.urls());
    var chapters = [];
    urls.forEach(requestUrl => {
        if (requestUrl.indexOf("api.truyen.onl/v2/chapters") >= 0) {
            var response = JSON.parse(Http.get(requestUrl).string());
            response._data.chapters.forEach(chapter => {
                chapters.push({
                    name: chapter.name,
                    url: "chuong-" + chapter.index,
                    host: url
                })
            });
        }
    });
    return Response.success(chapters);
}