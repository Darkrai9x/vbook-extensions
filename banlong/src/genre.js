load("config.js");

function execute() {
    let response = fetch(BASE_URL);
    if (response.ok) {
        let genres = [];
        response.html().select(".modal-story-genre li a").forEach(e => {
            genres.push({
                title: e.text(),
                input: BASE_URL + "/" + e.attr("href"),
                script: 'source.js'
            });
        });
        return Response.success(genres);
    }
    return null;
}