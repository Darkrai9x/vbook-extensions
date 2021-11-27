function execute(key, page) {
    if (!page) page = "1";
    let response = fetch("https://chivi.app/search?q=" + key + "&p=" + page);
    if (response.ok) {
        let doc = response.html();
        let next = "";
        let nextPage = doc.select(".pagi a._primary").attr("href");
        let pageRegex = /.*p=(\d+)/g;
        let result = pageRegex.exec(nextPage);
        if (result) next = result[1];

        let novelList = doc.select(".list .book").map(e => ({
            "name": e.select(".infos  ._title").text(),
            "link": e.select("a").first().attr("href"),
            "description": e.select(".infos  ._author").text(),
            "cover": e.select(".cover img").first().attr("src"),
            "host": "https://chivi.app"
        }));


        return Response.success(novelList, next);
    }
    return null;

}