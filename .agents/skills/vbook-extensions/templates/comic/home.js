// home.js — tabs shown on the home page. Each tab's `input` is passed as
// `query` to `script` (search.js) — see search.js: it treats a "/"-prefixed
// or absolute-URL query as a category path, not a keyword.
function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: "/truyen-moi-cap-nhat", script: "search.js" },
        { title: "Truyện mới", input: "/truyen-tranh-moi", script: "search.js" },
        { title: "Hoàn thành", input: "/truyen-hoan-thanh", script: "search.js" },
        { title: "Xem nhiều", input: "/top-ngay", script: "search.js" }
    ]);
}
