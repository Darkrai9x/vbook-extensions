load('config.js');
// Thread list; also the list script of home/genre/explore entries. A tap runs posts.js with `link`.
function execute(query, page) {
    query = query || "";
    page = page || "1";

    let url;
    if (query.indexOf("/") === 0 || query.indexOf("http") === 0) {
        let base = normalizeUrl(query);
        url = base + (base.indexOf("?") === -1 ? "?" : "&") + "page=" + page;
    } else {
        url = BASE_URL + "/search?q=" + encodeURIComponent(query) + "&page=" + page;
    }
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    // The app does not reorder: pinned threads must come first in the page order.
    let items = doc.select("SELECTOR_THREAD_ITEMS").map(function (el) {
        return {
            name: el.select("SELECTOR_THREAD_TITLE").text(),
            link: el.select("SELECTOR_THREAD_TITLE a").attr("href"),
            author: el.select("SELECTOR_THREAD_AUTHOR").text(),
            avatar: el.select("SELECTOR_THREAD_AVATAR img").attr("src"),
            time: el.select("SELECTOR_THREAD_TIME").text(),   // display text or epoch
            replies: el.select("SELECTOR_THREAD_REPLIES").text(),
            views: el.select("SELECTOR_THREAD_VIEWS").text(),
            board: el.select("SELECTOR_THREAD_BOARD").text(),
            last_post: {
                user: el.select("SELECTOR_LAST_POST_USER").text(),
                time: el.select("SELECTOR_LAST_POST_TIME").text()
            },
            pinned: el.select("SELECTOR_THREAD_PINNED").size() > 0,
            locked: el.select("SELECTOR_THREAD_LOCKED").size() > 0,
            hot: el.select("SELECTOR_THREAD_HOT").size() > 0
        };
    });

    let hasNext = doc.select("SELECTOR_NEXT_PAGE").size() > 0;
    return Response.success(items, hasNext ? String(parseInt(page) + 1) : "");
}
