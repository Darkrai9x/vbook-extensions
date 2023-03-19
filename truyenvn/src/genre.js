load('config.js');
function execute() {
    let response = fetch(BASE_URL + "/the-loai-truyen");
    if (response.ok) {
        let doc = response.html();
        let genres = [];
        doc.select(".theloai a").forEach(e => {
            genres.push({
                title: e.text(),
                input: e.attr("href"),
                script: "gen.js"
            });
        });
        return Response.success(genres);
    }
    return null;
}