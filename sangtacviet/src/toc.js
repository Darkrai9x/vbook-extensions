function execute(url) {
    if (url.slice(-1) !== "/")
        url = url + "/";
    let browser = Engine.newBrowser();
    browser.launchAsync(url);

    var retry = 0;
    let chapList = [];
    while (retry < 5) {
        sleep(2000)
        let doc = browser.callJs("document.getElementById('chaptercontainerinner').scrollIntoView();", 100);
        var el = doc.select("#chaptercontainerinner a");
        if (el.length > 0) {
            el.forEach(e => {
                chapList.push({
                    name: e.text(),
                    url: e.attr("href"),
                    pay: e.select(".vip").length > 0,
                    host: "https://sangtacviet.pro",
                });
            });
            break;
        }
        retry++;
    }

    browser.close()
    return Response.success(chapList);
}