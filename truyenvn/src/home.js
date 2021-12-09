function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: "https://truyenvn.vip/danh-sach-truyen", script: "gen.js" },
        { title: "Truyện Hot", input: "https://truyenvn.vip/truyen-hot", script: "gen.js" },
        { title: "Hoàn thành", input: "https://truyenvn.vip/truyen-hoan-thanh", script: "gen.js" }
    ]);
}