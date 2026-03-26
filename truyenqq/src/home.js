function execute() {
    return Response.success([
        {title: "Top Ngày", input: "/top-ngay", script: "gen.js"},
        {title: "Top Tuần", input: "/top-tuan", script: "gen.js"},
        {title: "Top Tháng", input: "/top-thang", script: "gen.js"},
        {title: "Yêu Thích", input: "/truyen-yeu-thich", script: "gen.js"},
        {title: "Mới Cập Nhật", input: "/truyen-moi-cap-nhat", script: "gen.js"},
        {title: "Truyện Mới", input: "/truyen-tranh-moi", script: "gen.js"},
        {title: "Truyện Full", input: "/truyen-hoan-thanh", script: "gen.js"},
        {title: "Truyện Ngẫu Nhiên", input: "/truyen-ngau-nhien", script: "gen.js"}
    ]);
}
