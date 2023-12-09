load("config.js");

function execute(url, page) {
    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        let books = [];
        doc.select("#newscontent > .l > ul > li").forEach(e => {
            books.push({
                name: e.select("a").last().text(),
                link: e.select("a").last().attr("href"),
                description: e.select(".s5").text(),
                host: BASE_URL
            })
        });

        return Response.success(books);
    }

    return null;
}