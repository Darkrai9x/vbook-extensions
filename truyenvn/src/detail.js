load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let genres = [];
        doc.select(".genres-content > a").forEach(e => {
            genres.push({
                title: e.text(),
                input: e.attr('href'),
                script: "gen.js"
            });
        });
        return Response.success({
            name: doc.select("h1").first().text(),
            cover: doc.select(".summary_image img").first().attr("data-lazy-src"),
            author: doc.select(".author-content").first().text(),
            description: doc.select(".description-summary p").html(),
            detail: doc.select(".summary-content").first().text()+'<br>Author : '+doc.select(".author-content").text(),
            host: BASE_URL,
            ongoing: doc.select(".post-content_item").text().indexOf("OnGoing") != -1,
            genres: genres,
            suggests: [
                {
                    title: "Có thể bạn quan tâm",
                    input: doc.select(".related-manga").html(),
                    script: "suggest.js"
                }
            ]
        });
    }
    return null;
}