load('config.js');

function execute(key, page) {
    let response = fetch(BASE_URL + "/tim-kiem?s=" + key.replace(" ", "+"));

    if (response.ok) {

        let doc = response.html();

        const data = [];
        doc.select("table.book__list").first().select(".book__list-item").forEach(e => {
            data.push({
                name: e.select(".book__list-name a").first().text(),
                link: e.select(".book__list-name a").first().attr("href"),
                cover: e.select(".book__list-image img").first().attr("data-src"),
                description: e.select(".book__list-author a").text(),
                host: BASE_URL
            })
        });

        return Response.success(data)
    }
    return null;
}