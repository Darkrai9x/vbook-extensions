function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: "https://truyenvn.com/danh-sach-truyen", script: "gen.js" },
        { title: "Truyện Hot", input: "https://truyenvn.com/truyen-hot", script: "gen.js" },
        { title: "Hoàn thành", input: "https://truyenvn.com/truyen-hoan-thanh", script: "gen.js" }
    ]);
}