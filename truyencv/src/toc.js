function execute(url) {
    var request = Http.get(url)
    var doc = request.html();
    var newUrl = request.url();

    if (doc) {
        if (newUrl.indexOf("metruyenchu.com") > 0) {
            return loadNewWeb(newUrl);
        } else if (newUrl.indexOf("nuhiep.com") > 0) {
            return loadNewWeb(newUrl);
        } else if (newUrl.indexOf("vtruyen.com") > 0) {
            return loadNewWeb(newUrl);
        }
        return loadOldWeb(newUrl, doc);
    }

    return null;
}

function loadNewWeb(newUrl) {
    var browser = Engine.newBrowser();

    browser.block([".*?api.truyen.onl/v2.*?"]);

    browser.launch(newUrl, 10000);
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
                    host: newUrl
                })
            });
        }
    });
    return Response.success(chapters);
}

function loadOldWeb(newUrl, doc) {
    var chapters = [];
    var hash = doc.select("div.truyencv-detail-tab").html().match(/showChapter\((.*?)\)/)
    if (!hash) return Response.error(newUrl);
    hash = hash[1].replace("'", "");
    var tbl = hash.split(",");

    doc = Http.post("https://truyencv.com/index.php").params({
        showChapter: 1,
        media_id: tbl[1],
        number: 1,
        page: 1,
        type: tbl[4]
    }).html();
    var el = doc.select("div.item a")
    el.select("span.text-muted").remove();

    if (doc.select("div.panel-vip").isEmpty()) {
        for (var i = el.size() - 1; i>= 0; i--){
            var e = el.get(i);
            chapters.push({
                name: e.text(),
            url: e.attr("href"),
            host: "http://truyencv.com"
            });
        }
    } else  {
        for (var i = 0; i < el.size(); i++){
            var e = el.get(i);
            chapters.push({
                name: e.text(),
                url: e.attr("href"),
                host: "http://truyencv.com"
            });
        }
    }
    return Response.success(chapters);
}



