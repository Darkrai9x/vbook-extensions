load("config.js");

function execute(url, page) {
    if (!page) page = '1';
    let response = fetch(url + "?page=" + page);
    if (response.ok) {
        let doc = response.html();

        let nextPage = /page=(\d+)/.exec(doc.select(".next-page").first().attr("href"));
        if (nextPage) nextPage = nextPage[1];
        else nextPage = "";

        let books = [];
        doc.select(".list-story__item li").forEach(e => {
            books.push({
                name: e.select("p.line-clamp-1").text(),
                link: e.select("a").attr("href").replace(/chuong-\d+/g, ""),
                description: e.select("a.line-clamp-1").text(),
                host: BASE_URL,
            });
        });

        return Response.success(books, nextPage);
    }
    return null;
}