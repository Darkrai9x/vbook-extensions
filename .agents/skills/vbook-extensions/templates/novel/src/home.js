// A `type: "explore"` tab calls its script as execute(input) and shows explore sections.
function execute() {
    return Response.success([
        { title: "Trang chủ", input: "", script: "explore.js", type: "explore" },
        { title: "Mới cập nhật", input: "/moi-cap-nhat", script: "search.js" },
        { title: "Đang phát hành", input: "/dang-phat-hanh", script: "search.js" },
        { title: "Hoàn thành", input: "/hoan-thanh", script: "search.js" },
        { title: "Xem nhiều", input: "/xem-nhieu", script: "search.js" }
    ]);
}
