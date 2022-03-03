function execute(key, page) {
    let response = fetch("http://m.fansg.com/search.html", {
        method: "POST",
        body: {
            keyword: key
        }
    });

    if (response.ok) {
        let doc = response.html();
        let bookList = [];
        doc.select(".search-list li").forEach(e => {
            bookList.push({
                name: e.select("a").first().text(),
                link: e.select("a").first().attr("href"),
                cover: e.select("img").first().attr("src"),
                description: e.select(".info").text(),
                host: "http://m.fansg.com"
            });
        });
        return Response.success(bookList);
    }

    return null;
}