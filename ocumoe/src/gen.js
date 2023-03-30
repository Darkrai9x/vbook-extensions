load('config.js');
function execute(url, page) {

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        const data = [];

        doc.select("ul.single-list-comic > li").forEach(e => {
            data.push({
                name: e.select("a").first().text(),
                link: e.select("a").first().attr("href"),
                cover: e.select("img").first().attr("src"),
                description: e.select(".cat-score").first().text(),
                host: BASE_URL
            })
        })

        return Response.success(data)
    }

    return null;
}