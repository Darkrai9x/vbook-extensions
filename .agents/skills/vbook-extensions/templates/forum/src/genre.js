load('config.js');
// Boards; each opens its thread list through search.js.
function execute() {
    let response = fetch(BASE_URL + "/forums");
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    return Response.success(doc.select("SELECTOR_BOARD_LINKS a").map(function (el) {
        return { title: el.text(), input: el.attr("href"), script: "search.js" };
    }));
}
