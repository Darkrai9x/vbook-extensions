load("config.js");

function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let info = doc.select(".info-story");
        let genres = [];
        info.select("a[href^=the-loai]").forEach(e => {
            genres.push({
                title: e.text(),
                input: BASE_URL + "/" + e.attr("href"),
                script: "source.js"
            });
        });
        return Response.success({
            name: info.select("h1").text(),
            cover: doc.select(".image-story img").attr("src"),
            author: info.select("a[href^=tac-gia]").text(),
            description: doc.select("#tab-info-1 .s-content").html(),
            genres: genres,
            detail: info.select(".story-info").html(),
            ongoing: info.text().indexOf("Đã hoàn thành") === -1,
            host: BASE_URL,
        });
    }
    return Response.success(JSON.parse(json));
}