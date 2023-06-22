load("config.js");

function execute(url, page) {
    if (page) {
        page = "1";
    }
    let response = fetch(url + "/" + page);
    if (response.ok) {
        let doc = response.html();
        let bookList = [];
        doc.select(".am-g-collapse").last().select(".book-list-1").forEach(e => {
            bookList.push({
                name: e.select(".book-list-1-info a").text(),
                link: e.select("a").first().attr("href"),
                cover: e.select("img.am-thumbnail").attr("data-src"),
                description: e.select(".book-list-1-author").text(),
                host: BASE_URL
            });
        });

        let next = doc.select(".am-pagination ").select("strong + a").text();
        return Response.success(bookList, next);
    }

    return null;
}