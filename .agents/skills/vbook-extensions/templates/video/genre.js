load('config.js');
// genre.js — genre/tag list. Each entry's `input` (a category path) is passed
// to `script` (search.js) the same way home.js tabs do.
function execute() {
    let response = fetch(BASE_URL + "/the-loai");
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let genres = doc.select("SELECTOR_GENRE_LIST a").map(function (el) {
        return {
            title: el.text(),
            input: el.attr("href"),
            script: "search.js"
        };
    });

    return Response.success(genres);
}