// home.js — tabs shown on the home page. Each tab's `input` is passed as
// `query` to `script` (search.js) — see search.js: it treats a "/"-prefixed
// or absolute-URL query as a category path, not a keyword.
function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: "/moi-cap-nhat", script: "search.js" },
        { title: "Album", input: "/album", script: "search.js" },
        { title: "Bài hát", input: "/bai-hat", script: "search.js" },
        { title: "Nghe nhiều", input: "/nghe-nhieu", script: "search.js" }
    ]);
}
