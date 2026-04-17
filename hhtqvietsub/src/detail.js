load('config.js');

function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let genres = [];
        doc.select(".list_cate a").forEach(e => {
            genres.push({
                title: e.text(),
                input: e.attr("href"),
                script: "gen.js"
            });
        });

        let suggests = [];
        parseCards(doc, ".related-movies article").forEach(e => {
            suggests.push({
                title: e.name,
                input: e.link,
                script: "detail.js"
            });
        });

        let detail = [];
        let alt = doc.select(".org_title").text();
        let latest = doc.select(".new-ep").text();
        let release = doc.select(".released").text();
        if (alt) detail.push("Tên khác: " + alt);
        if (latest) detail.push("Mới nhất: " + latest);
        if (release) detail.push("Năm phát hành: " + release);

        return Response.success({
            name: doc.select(".movie_name").text(),
            cover: doc.select(".head .first img").attr("src"),
            author: "HHTQ Vietsub",
            description: doc.select(".entry-content.htmlwrap .video-item article").html(),
            detail: detail.join("<br>"),
            ongoing: doc.select(".new-ep").text().toLowerCase().indexOf("hoàn") < 0,
            genres: genres,
            suggests: suggests,
            format: "series",
            host: BASE_URL
        });
    }
    return null;
}
