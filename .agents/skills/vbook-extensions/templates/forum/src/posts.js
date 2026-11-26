load('config.js');
// One page of a thread. Returning { posts, page, total_pages } with page-number tokens
// lets the user jump: the app calls execute(url, "7") for page 7.
function execute(url, page) {
    url = normalizeUrl(url);
    let n = parseInt(page) || 1;   // first call: page is ""

    let response = fetch(url + (url.indexOf("?") === -1 ? "?" : "&") + "page=" + n);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let posts = doc.select("SELECTOR_POST_ITEMS").map(function (el) {
        return {
            id: el.attr("data-id"),   // stable id dedupes posts across pages (else floor)
            floor: el.select("SELECTOR_POST_FLOOR").text(),
            url: el.select("SELECTOR_POST_PERMALINK").attr("href"),
            is_op: el.hasClass("op"),
            time: el.select("SELECTOR_POST_TIME").text(),
            user: {
                name: el.select("SELECTOR_USER_NAME").text(),   // required
                avatar: el.select("SELECTOR_USER_AVATAR img").attr("src"),
                link: el.select("SELECTOR_USER_NAME a").attr("href")
            },
            content: el.select("SELECTOR_POST_CONTENT").html(),
            content_format: "html"
        };
    });

    // last() on an empty selection is an empty element: parseInt("") is NaN -> fall back to n.
    let total = Math.max(n, parseInt(doc.select("SELECTOR_PAGINATION_LAST_PAGE").last().text()) || n);
    return Response.success({ posts: posts, page: n, total_pages: total }, n < total ? String(n + 1) : "");
}
