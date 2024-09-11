load('config.js');

function execute(url, page) {
    let response = fetch(BASE_URL);
    if (response.ok) {
        let doc = response.html();

        let bookList = [];
        doc.select(".layout-col1").last().select("li").forEach(e => {
            bookList.push({
                name: e.select(".s2 a").first().text(),
                link: e.select(".s2 a").first().attr("href"),
                description: e.select(".s5").text(),
                host: BASE_URL
            });
        })
        return Response.success(bookList);
    }

    return null;
}