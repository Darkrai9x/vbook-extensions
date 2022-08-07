function execute(url, page) {
    if (!page) page = '1';
    let response = fetch(url + "?page=" + page);

    if (response.ok) {

        let doc = response.html();

        let next = doc.select(".pagination").select(".active + li").select("a").text();

        const data = [];
        doc.select(".book__list .book__list-item").forEach(e => {
            data.push({
                name: e.select(".book__list-name a").first().text(),
                link: e.select(".book__list-name a").first().attr("href"),
                cover: e.select(".book__list-image img").first().attr("data-src"),
                description: e.select(".book__list-author").text() + " " + e.select(".book__list-chaper").text(),
                host: "https://luvevaland.co"
            })
        });

        return Response.success(data, next)
    }
    return null;
}