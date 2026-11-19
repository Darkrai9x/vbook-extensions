load('config.js');
// posts.js — `url` is the thread's `link`; `page` is the token returned last time as
// data2 (empty on the first call). Return ONE page of posts as data, the next token as
// data2 (empty at the end).
function execute(url, page) {
    url = normalizeUrl(url);
    page = page || "1";

    let pageUrl = url + (url.indexOf("?") === -1 ? "?" : "&") + "page=" + page;
    let response = fetch(pageUrl);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let posts = doc.select("SELECTOR_POST_ITEMS").map(function (el) {
        return {
            id: el.attr("data-id"),                  // id (else floor) dedupes across pages
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
            content_format: "html"                   // "html" | "markdown"
        };
    });

    let hasNext = !doc.select("SELECTOR_NEXT_PAGE").isEmpty();
    return Response.success(posts, hasNext ? String(parseInt(page) + 1) : "");
}
