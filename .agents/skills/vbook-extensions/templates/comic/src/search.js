load('config.js');
// Also the list script of home/genre/explore entries: a query starting with "/" or "http" is a category path.
function execute(query, page) {
    query = query || "";
    page = page || "1";

    let url;
    if (query.indexOf("/") === 0 || query.indexOf("http") === 0) {
        let base = normalizeUrl(query);
        url = base + (base.indexOf("?") === -1 ? "?" : "&") + "page=" + page;
    } else {
        url = BASE_URL + "/tim-kiem?q=" + encodeURIComponent(query) + "&page=" + page;
    }
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let items = doc.select("SELECTOR_RESULT_ITEMS").map(function (el) {
        return {
            name: el.select("SELECTOR_ITEM_NAME").text(),
            cover: el.select("SELECTOR_ITEM_COVER img").attr("src"),
            link: el.select("SELECTOR_ITEM_LINK a").attr("href"),
            description: el.select("SELECTOR_ITEM_LAST_CHAP").text(),
            tag: el.select("SELECTOR_ITEM_STATUS").text()
        };
    });

    // Next token must be a string; "" ends the list.
    let hasNext = doc.select("SELECTOR_NEXT_PAGE").size() > 0;
    return Response.success(items, hasNext ? String(parseInt(page) + 1) : "");
}
