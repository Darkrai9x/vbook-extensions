function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img,"https://metruyencv.com")
    var browser = Engine.newBrowser();
    browser.setUserAgent(UserAgent.android());

    browser.block([".*?api.truyen.onl/v2.*?"]);

    browser.launch(url, 10000);
    browser.callJs("for(const a of document.querySelectorAll('a')){if(a.textContent.includes('Danh sách chương')){a.click()}}", 500);
    browser.waitUrl(".*?api.truyen.onl/v2.*?", 10000);
    browser.close()

    var urls = JSON.parse(browser.urls());
    var chapters = [];
    urls.forEach(requestUrl => {
        if (requestUrl.indexOf("api.truyen.onl/v2/chapters") >= 0) {
            var response = fetch(requestUrl, {
                headers: {
                    'user-agent': UserAgent.android()
                }
            }).json();
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