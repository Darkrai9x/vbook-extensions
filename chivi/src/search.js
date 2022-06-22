function execute(key, page) {
    if (!page) page = "1";
    let response = fetch("https://chivi.app/books/query?q=" + key + "&pg=" + page);
    if (response.ok) {
        let doc = response.html();
        let next = "";
        let nextPage = doc.select(".pagi a._primary").attr("href");
        let pageRegex = /.*pg=(\d+)/g;
        let result = pageRegex.exec(nextPage);
        if (result) next = result[1];

        let novelList = [];
        doc.select("book-list > a").forEach(e => novelList.push({
            "name": e.select("._title").text(),
            "link": e.select("a").first().attr("href"),
            "description": e.select(".infos .info").get(1).text(),
            "cover": "https://chivi.app" + e.select("source").first().attr("srcset"),
            "host": "https://chivi.app"
        }));


        return Response.success(novelList, next);
    }
    return null;

}