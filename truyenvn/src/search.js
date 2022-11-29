function execute(key, page) {
    var browser = Engine.newBrowser();
    browser.setUserAgent(UserAgent.android());
    var doc = browser.launch("https://truyenvnpro.com/wp-admin/admin-ajax.php?action=resultautosearch&key=" + key, 3000);
    browser.close()
            // var doc = Http.get(.html(),
        // }).html()
    // const doc = Http.get("https://truyenvnpro.com/danh-sach-truyen?q=" + key).html();
console.log(doc)
    const el = doc.select(".align-items-center")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.text(),
            link: e.attr("href"),
            cover: e.select("img").attr("src"),
            description: null,
            host: "https://truyenvnpro.com"
        })
    }

    return Response.success(data)
}