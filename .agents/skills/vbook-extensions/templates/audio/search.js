load('config.js');
// search.js — doubles as the listing script for home.js/genre.js tabs.
// `query` is either a search keyword, or a category path/URL passed as
// `input` from a home/genre tab (see extension-api.md: "query = search text,
// or a filter/category input").
function execute(query, page) {
    query = query || "";
    page = page || "1";

    let url;
    if (query.indexOf("/") === 0 || query.indexOf("http") === 0) {
        // browsing a tab: query is a category path or full URL, not a keyword
        let base = query.indexOf("http") === 0 ? query : BASE_URL + query;
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
            description: el.select("SELECTOR_ITEM_DESC").text(),
            tag: el.select("SELECTOR_ITEM_STATUS").text()
        };
    });

    let hasNext = !doc.select("SELECTOR_NEXT_PAGE").isEmpty();
    let nextPage = hasNext ? (parseInt(page) + 1).toString() : "";

    return Response.success(items, nextPage);
}