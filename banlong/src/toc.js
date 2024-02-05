load("config.js");

function execute(url) {
    let response = fetch(BASE_URL + url);
    if (response.ok) {
        let doc = response.html();
        let chapters = [];
        doc.select(".table-list__chapter a").forEach(e => {
            chapters.push({
                name: e.text(),
                url: e.attr("href"),
                host: BASE_URL,
            });
        });
        return Response.success(chapters);
    }
    return null;

}