function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: "https://truyenvn.tv/danh-sach-truyen", script: "gen.js" },
        { title: "Truyện Hot", input: "https://truyenvn.tv/truyen-hot", script: "gen.js" },
        { title: "Hoàn thành", input: "https://truyenvn.tv/truyen-hoan-thanh", script: "gen.js" }
    ]);
}