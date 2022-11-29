function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: "https://truyenvnpro.com/danh-sach-truyen", script: "gen.js" },
        { title: "Truyện Hot", input: "https://truyenvnpro.com/truyen-hot", script: "gen.js" },
        { title: "Hoàn thành", input: "https://truyenvnpro.com/truyen-hoan-thanh", script: "gen.js" }
    ]);
}