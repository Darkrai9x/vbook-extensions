function execute() {
    return Response.success([
        {title: "Top Ngày", input: "http://truyenqqtop.com/top-ngay.html", script: "gen.js"},
        {title: "Top Tuần", input: "http://truyenqqtop.com/top-tuan.html", script: "gen.js"},
        {title: "Top Tháng", input: "http://truyenqqtop.com/top-thang.html", script: "gen.js"},
        {title: "Yêu Thích", input: "http://truyenqqtop.com/truyen-yeu-thich.html", script: "gen.js"},
        {title: "Mới Cập Nhật", input: "http://truyenqqtop.com/truyen-moi-cap-nhat.html", script: "gen.js"},
        {title: "Truyện Mới", input: "http://truyenqqtop.com/truyen-tranh-moi.html", script: "gen.js"},
        {title: "Truyện Full", input: "http://truyenqqtop.com/truyen-hoan-thanh.html", script: "gen.js"}
    ]);
}
