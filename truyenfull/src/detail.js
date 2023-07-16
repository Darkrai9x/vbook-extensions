load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let genres = [];
        let author = doc.select("a[itemprop=author]");
        genres.push({
            title: author.text(),
            input: author.attr("href"),
            script: "gen.js"
        });
        doc.select(".info a[itemprop=genre]").forEach(e => {
            genres.push({
                title: e.text(),
                input: e.attr("href"),
                script: "gen.js"
            });
        });
        let suggests = [];
        suggests.push({
            title: "Cùng tác giả",
            input: author.attr('href'),
            script: "gen.js"
        });
        return Response.success({
            name: doc.select("h3.title").text(),
            cover: doc.select("div.book img").attr("src"),
            author: doc.select("div.info div a").first().text(),
            description: doc.select("div.desc-text").html(),
            detail: "",
            ongoing: doc.select("div.info").html().indexOf(">Đang ra<") > 0,
            genres: genres,
            suggests: suggests,
            host: BASE_URL
        });
    }
    return null;
}