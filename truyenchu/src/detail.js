load('config.js');

function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let genres = [];
        doc.select("[itemProp=genre]").forEach(e => {
            genres.push({
                title: e.text(),
                input: e.attr("href"),
                script: "gen.js"
            });
        });
        return Response.success({
            name: doc.select("h1").text(),
            cover: doc.select("[itemProp=thumbnailUrl]").attr("content"),
            author: doc.select("[itemProp=author]").first().text(),
            description: doc.select("[itemProp=description]").html(),
            genres: genres,
            detail: doc.select("div.info").html(),
            ongoing: doc.select(".justify-end.grow").html().indexOf(">Hoàn thành<") === -1,
            host: BASE_URL
        });
    }
    return null;
}