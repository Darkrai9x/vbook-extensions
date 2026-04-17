load('config.js');

function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: BASE_URL, script: "update.js" },
        { title: "Đang chiếu", input: BASE_URL + "/dang-chieu", script: "gen.js" },
        { title: "Hoàn thành", input: BASE_URL + "/hoan-thanh", script: "gen.js" },
        { title: "Đánh giá cao", input: BASE_URL + "/danh-gia-cao", script: "gen.js" },
        { title: "Phim lẻ", input: BASE_URL + "/phim-le", script: "gen.js" },
        { title: "Top 10 HH3D", input: BASE_URL + "/top-10", script: "gen.js" }
    ]);
}
