// home.js — tabs shown on the home page. Each tab's `input` is passed as
// `query` to `script` (search.js) — see search.js: it treats a "/"-prefixed
// or absolute-URL query as a category path, not a keyword.
function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: "/moi-cap-nhat", script: "search.js" },
        { title: "Đang phát hành", input: "/dang-phat-hanh", script: "search.js" },
        { title: "Hoàn thành", input: "/hoan-thanh", script: "search.js" },
        { title: "Xem nhiều", input: "/xem-nhieu", script: "search.js" }
    ]);
}
