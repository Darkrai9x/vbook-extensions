load('config.js');
// Comment source (detail `comments`/`reviews`): execute(input, next) -> (items, next token).
// Item format: "Paragraph comments (novel)" in extension-api.md.
function execute(input, next) {
    let page = parseInt(next) || 1;
    let url = input.indexOf("http") === 0 ? input : BASE_URL + input;
    url += (url.indexOf("?") === -1 ? "?" : "&") + "page=" + page;

    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let items = doc.select("SELECTOR_COMMENT_ITEMS").map(function (el) {
        return {
            name: el.select("SELECTOR_COMMENT_AUTHOR").text(),
            avatar: el.select("SELECTOR_COMMENT_AVATAR img").attr("src"),
            content: el.select("SELECTOR_COMMENT_CONTENT").html(),
            description: el.select("SELECTOR_COMMENT_TIME").text(),
            replies: el.select("SELECTOR_REPLY_ITEMS").map(function (r) {
                return {
                    name: r.select("SELECTOR_COMMENT_AUTHOR").text(),
                    avatar: r.select("SELECTOR_COMMENT_AVATAR img").attr("src"),
                    content: r.select("SELECTOR_COMMENT_CONTENT").html(),
                    description: r.select("SELECTOR_COMMENT_TIME").text()
                };
            })
            // Optional: replies loaded page by page via another comment script (replaces `replies`):
            // reply: { input: el.attr("data-id"), script: "replies.js" },
            // reply_count: parseInt(el.select("SELECTOR_REPLY_COUNT").text()) || 0
        };
    });

    let hasNext = doc.select("SELECTOR_NEXT_PAGE").size() > 0;
    return Response.success(items, hasNext ? String(page + 1) : "");
}
