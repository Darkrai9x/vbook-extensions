load('config.js');
// search.js — doubles as the listing script for home.js/genre.js tabs.
// A tap on an item runs article.js with the item's `link`; there is no detail page.
function execute(query, page) {
    query = query || "";
    page = page || "1";

    let url;
    if (query.indexOf("/") === 0 || query.indexOf("http") === 0) {
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
            description: el.select("SELECTOR_ITEM_LEAD").text(),   // lead of the article
            author: el.select("SELECTOR_ITEM_AUTHOR").text(),
            time: el.select("SELECTOR_ITEM_TIME").text()           // display text or epoch
        };
    });

    let hasNext = !doc.select("SELECTOR_NEXT_PAGE").isEmpty();
    return Response.success(items, hasNext ? (parseInt(page) + 1).toString() : "");
}
