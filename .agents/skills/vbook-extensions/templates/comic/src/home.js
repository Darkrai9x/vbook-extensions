// A `type: "explore"` tab calls its script as execute(input) and shows explore sections.
function execute() {
    return Response.success([
        { title: "Trang chủ", input: "", script: "explore.js", type: "explore" },
        { title: "Mới cập nhật", input: "/truyen-moi-cap-nhat", script: "search.js" },
        { title: "Truyện mới", input: "/truyen-tranh-moi", script: "search.js" },
        { title: "Hoàn thành", input: "/truyen-hoan-thanh", script: "search.js" },
        { title: "Xem nhiều", input: "/top-ngay", script: "search.js" }
    ]);
}
