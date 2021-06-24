function execute() {
    return Response.success([
        {title: "Top Ngày", input: "http://truyenqq.com/top-ngay.html", script: "gen.js"},
        {title: "Top Tuần", input: "http://truyenqq.com/top-tuan.html", script: "gen.js"},
        {title: "Top Tháng", input: "http://truyenqq.com/top-thang.html", script: "gen.js"},
        {title: "Yêu Thích", input: "http://truyenqq.com/truyen-yeu-thich.html", script: "gen.js"},
        {title: "Mới Cập Nhật", input: "http://truyenqq.com/truyen-moi-cap-nhat.html", script: "gen.js"},
        {title: "Truyện Mới", input: "http://truyenqq.com/truyen-tranh-moi.html", script: "gen.js"},
        {title: "Truyện Full", input: "http://truyenqq.com/truyen-hoan-thanh.html", script: "gen.js"}
    ]);
}
