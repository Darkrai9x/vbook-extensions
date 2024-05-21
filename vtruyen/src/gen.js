load("config.js")

function execute(url, page) {
    let novelList = [];
    let next = "";
    if (!page) {
        let browser = Engine.newBrowser();

        browser.block([".*?api/books*?"]);

        browser.launch(url, 1000);
        browser.waitUrl(".*?api/books.*?", 10000);
        browser.close();

        let urls = JSON.parse(browser.urls());

        urls.forEach(requestUrl => {
            if (requestUrl.indexOf("api/books") >= 0) {
                let response = fetch(requestUrl).json();
                if (response.pagination && response.pagination.next) {
                    next = requestUrl.replace(/page=\d+/i, "page=" + response.pagination.next);
                }
                response.data.forEach(book => {
                    novelList.push({
                        name: book.name,
                        link: book.link,
                        description: book.author.name,
                        cover: book.poster['default'],
                        host: BASE_URL
                    })
                });
            }
        });
    } else {
        let response = fetch(page).json();
        if (response.pagination && response.pagination.next) {
            next = page.replace(/page=\d+/i, "page=" + response.pagination.next);
        }
        response.data.forEach(book => {
            novelList.push({
                name: book.name,
                link: book.link,
                description: book.author.name,
                cover: book.poster['default'],
                host: BASE_URL
            })
        });
    }
    return Response.success(novelList, next);
}