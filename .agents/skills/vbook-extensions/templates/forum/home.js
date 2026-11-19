// home.js — tabs shown on the home page. Each tab's `input` is passed as
// `query` to `script` (search.js), which treats a "/"-prefixed or absolute-URL
// query as a category path, not a keyword.
function execute() {
    return Response.success([
        { title: "Mới nhất", input: "/tin-moi", script: "search.js" },
        { title: "Nổi bật", input: "/noi-bat", script: "search.js" }
        // A tab whose script returns explore sections (same format as explore.js) instead of a
        // list: add type: "explore", e.g. { title: "Trang chủ", input: "", script: "feed.js", type: "explore" }
    ]);
}
