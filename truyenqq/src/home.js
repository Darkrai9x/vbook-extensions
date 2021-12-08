function execute() {
    return Response.success([
        {title: "Top Ngày", input: "http://truyenqqvip.com/top-ngay.html", script: "gen.js"},
        {title: "Top Tuần", input: "http://truyenqqvip.com/top-tuan.html", script: "gen.js"},
        {title: "Top Tháng", input: "http://truyenqqvip.com/top-thang.html", script: "gen.js"},
        {title: "Yêu Thích", input: "http://truyenqqvip.com/truyen-yeu-thich.html", script: "gen.js"},
        {title: "Mới Cập Nhật", input: "http://truyenqqvip.com/truyen-moi-cap-nhat.html", script: "gen.js"},
        {title: "Truyện Mới", input: "http://truyenqqvip.com/truyen-tranh-moi.html", script: "gen.js"},
        {title: "Truyện Full", input: "http://truyenqqvip.com/truyen-hoan-thanh.html", script: "gen.js"}
    ]);
}
