function execute() {
    return Response.success([
        {title: "Top Ngày", input: "http://truyenqqpro.com/top-ngay.html", script: "gen.js"},
        {title: "Top Tuần", input: "http://truyenqqpro.com/top-tuan.html", script: "gen.js"},
        {title: "Top Tháng", input: "http://truyenqqpro.com/top-thang.html", script: "gen.js"},
        {title: "Yêu Thích", input: "http://truyenqqpro.com/truyen-yeu-thich.html", script: "gen.js"},
        {title: "Mới Cập Nhật", input: "http://truyenqqpro.com/truyen-moi-cap-nhat.html", script: "gen.js"},
        {title: "Truyện Mới", input: "http://truyenqqpro.com/truyen-tranh-moi.html", script: "gen.js"},
        {title: "Truyện Full", input: "http://truyenqqpro.com/truyen-hoan-thanh.html", script: "gen.js"}
    ]);
}
