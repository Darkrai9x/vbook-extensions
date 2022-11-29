function execute(url, page) {
    if (!page) page = '1';
    var browser = Engine.newBrowser();
    browser.setUserAgent(UserAgent.android());
    var doc = browser.launch(url + "/page/" + page, 3000);
    browser.close()
    var next = doc.select(".z-pagination").select(".next").select("a").attr("href").match(/page\/(\d+)/)
    if (next) next = next[1]

    const el = doc.select(".comics-grid .entry")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.select(".name a").first().text(),
            link: e.select(".name a").first().attr("href"),
            cover: e.select("img").first().attr("data-src"),
            description: e.select("h4 a").text(),
            host: "https://truyenvnpro.com"
        })
    }

    return Response.success(data, next)
}