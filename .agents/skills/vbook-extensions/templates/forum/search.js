load('config.js');
// search.js — thread (or board) list; doubles as the listing script for home.js/genre.js.
// A tap on a thread runs posts.js with the item's `link`; there is no detail page.
// Put pinned threads first yourself.
function execute(query, page) {
    query = query || "";
    page = page || "1";

    let url;
    if (query.indexOf("/") === 0 || query.indexOf("http") === 0) {
        let base = query.indexOf("http") === 0 ? query : BASE_URL + query;
        url = base + (base.indexOf("?") === -1 ? "?" : "&") + "page=" + page;
    } else {
        url = BASE_URL + "/search?q=" + encodeURIComponent(query) + "&page=" + page;
    }
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let items = doc.select("SELECTOR_THREAD_ITEMS").map(function (el) {
        return {
            name: el.select("SELECTOR_THREAD_TITLE").text(),
            link: el.select("SELECTOR_THREAD_TITLE a").attr("href"),
            author: el.select("SELECTOR_THREAD_AUTHOR").text(),
            avatar: el.select("SELECTOR_THREAD_AVATAR img").attr("src"),
            time: el.select("SELECTOR_THREAD_TIME").text(),
            replies: el.select("SELECTOR_THREAD_REPLIES").text(),
            views: el.select("SELECTOR_THREAD_VIEWS").text(),
            board: el.select("SELECTOR_THREAD_BOARD").text(),
            pinned: !el.select("SELECTOR_THREAD_PINNED").isEmpty(),
            locked: !el.select("SELECTOR_THREAD_LOCKED").isEmpty()
        };
    });

    let hasNext = !doc.select("SELECTOR_NEXT_PAGE").isEmpty();
    return Response.success(items, hasNext ? (parseInt(page) + 1).toString() : "");
}
