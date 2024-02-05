load("config.js");

function execute(key, page) {
    if (!page) page = '1';
    let response = fetch(BASE_URL + "/tim-kiem?q=" + key.replace(" ", "+") + "&page=" + page);
    if (response.ok) {
        let doc = response.html();

        let nextPage = /page=(\d+)/.exec(doc.select(".next-page").first().attr("href"));
        if (nextPage) nextPage = nextPage[1];
        else nextPage = "";

        let books = [];
        doc.select(".basis-full").select(".novel-item").forEach(e => {
            let type = e.select("a[href^=danh-muc]").text();
            if (type) {
                type = "[" + type + "] ";
            }
            books.push({
                name: type + e.select("h3").text(),
                link: e.select("a").first().attr("href"),
                cover: e.select("img").first().attr("src"),
                description: e.select(".author ").text() + "<br>" + e.select(".story-info").text(),
                host: BASE_URL,
            });
        });

        return Response.success(books, nextPage);
    }
}
