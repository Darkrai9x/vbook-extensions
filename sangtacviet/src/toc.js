function execute(url) {
    if (url.slice(-1) !== "/")
        url = url + "/";
    let browser = Engine.newBrowser();
    browser.launchAsync(url);
    var retry = 0;
    while (retry < 5) {
        sleep(1000)
        let doc = browser.html();
        if (doc.select("#chaptercontainerinner").length > 0) {
            browser.callJs("document.getElementById('chaptercontainerinner').scrollIntoView();", 100);
            break;
        }
        retry++;
    }

    retry = 0;
    var el;
    while (retry < 5) {
        sleep(1000)
        let doc = browser.html();
        if (doc.select("a.listchapitem").length > 0) {
            el = doc.select("a.listchapitem");
            break;
        }
        retry++;
    }
    browser.close()

    if (el) {
        let list = [];
        for (let i = 0; i < el.length; i++) {
            var e = el.get(i);
            list.push({
                name: e.text(),
                url: url + "----/----" + i
            })
        }
        return Response.success(list);
    }

    return null;
}