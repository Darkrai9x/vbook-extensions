// A `type: "explore"` tab calls its script as execute(input) and shows explore sections.
function execute() {
    return Response.success([
        { title: "Trang chủ", input: "", script: "explore.js", type: "explore" },
        { title: "Mới cập nhật", input: "/phim-moi-cap-nhat", script: "search.js" },
        { title: "Phim bộ", input: "/phim-bo", script: "search.js" },
        { title: "Phim lẻ", input: "/phim-le", script: "search.js" },
        { title: "Xem nhiều", input: "/xem-nhieu", script: "search.js" }
    ]);
}
