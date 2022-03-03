function execute(url, page) {
    if (!page) {
        page = "1";
    }

    let response = fetch(url + "?page=" + page);
    if (response.ok) {
        let doc = response.html();
        let bookList = [];
        let next = doc.select(".pagination").select("li.active + li").text();
        doc.select(".book-list li").forEach(e => {
            bookList.push({
                name: e.select("a").first().text(),
                link: e.select("a").first().attr("href"),
                cover: e.select("img").first().attr("src"),
                description: e.select(".info").text(),
                host: "http://m.fansg.com"
            });
        });
        return Response.success(bookList, next);
    }

    return null;
}