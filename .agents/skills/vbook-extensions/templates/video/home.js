// home.js — tabs shown on the home page. Each tab's `input` is passed as
// `query` to `script` (search.js) — see search.js: it treats a "/"-prefixed
// or absolute-URL query as a category path, not a keyword.
function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: "/phim-moi-cap-nhat", script: "search.js" },
        { title: "Phim bộ", input: "/phim-bo", script: "search.js" },
        { title: "Phim lẻ", input: "/phim-le", script: "search.js" },
        { title: "Xem nhiều", input: "/xem-nhieu", script: "search.js" }
    ]);
}
