load('config.js');
// comments.js — referenced from detail.js `comments` ({title, input, script}).
// Paginated: (input, page) -> (items, next). Each item may nest `replies`
// (same shape, recursive). See "comment scripts" in extension-api.md.
function execute(input, page) {
    page = page || "1";
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
            replies: el.select("SELECTOR_COMMENT_REPLIES SELECTOR_COMMENT_ITEMS").map(function (r) {
                return {
                    name: r.select("SELECTOR_COMMENT_AUTHOR").text(),
                    avatar: r.select("SELECTOR_COMMENT_AVATAR img").attr("src"),
                    content: r.select("SELECTOR_COMMENT_CONTENT").html(),
                    description: r.select("SELECTOR_COMMENT_TIME").text(),
                    replies: []
                };
            })
        };
    });

    let hasNext = !doc.select("SELECTOR_NEXT_PAGE").isEmpty();
    let nextPage = hasNext ? (parseInt(page) + 1).toString() : "";

    return Response.success(items, nextPage);
}
