load('config.js');
function execute() {
    let response = fetch(BASE_URL + "/the-loai");
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    return Response.success(doc.select("SELECTOR_GENRE_LIST a").map(function (el) {
        return { title: el.text(), input: el.attr("href"), script: "search.js" };
    }));
}
