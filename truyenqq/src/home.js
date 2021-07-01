function execute() {
    return Response.success([
        {title: "Top Ngày", input: "http://truyenqq.net/top-ngay.html", script: "gen.js"},
        {title: "Top Tuần", input: "http://truyenqq.net/top-tuan.html", script: "gen.js"},
        {title: "Top Tháng", input: "http://truyenqq.net/top-thang.html", script: "gen.js"},
        {title: "Yêu Thích", input: "http://truyenqq.net/truyen-yeu-thich.html", script: "gen.js"},
        {title: "Mới Cập Nhật", input: "http://truyenqq.net/truyen-moi-cap-nhat.html", script: "gen.js"},
        {title: "Truyện Mới", input: "http://truyenqq.net/truyen-tranh-moi.html", script: "gen.js"},
        {title: "Truyện Full", input: "http://truyenqq.net/truyen-hoan-thanh.html", script: "gen.js"}
    ]);
}
