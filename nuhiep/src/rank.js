function execute(url, page) {
    if (!page) page = '1';
    var browser = Engine.newBrowser();

    browser.block([".*?api.truyen.onl/v2/books.*?"]);

    browser.launch(url + "&page=" + page, 1000);
    browser.waitUrl(".*?api.truyen.onl/v2/books.*?", 10000);
    browser.close()

    var urls = JSON.parse(browser.urls());
    var novelList = [];
    var next = "";
    urls.forEach(requestUrl => {
        if (requestUrl.indexOf("api.truyen.onl/v2/books") >= 0) {
            var response = JSON.parse(Http.get(requestUrl).string());
            next = response._extra._pagination._next;
            response._data.forEach(book => {
                novelList.push({
                    name: book.name,
                    link: "/truyen/" + book.slug,
                    description: book.author_name,
                    cover: book['poster']['default'],
                    host: "https://nuhiep.com"
                })
            });
        }
    });
    return Response.success(novelList, next);
}