function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: "https://truyenvnhot.com/danh-sach-truyen", script: "gen.js" },
        { title: "Truyện Hot", input: "https://truyenvnhot.com/truyen-hot", script: "gen.js" },
        { title: "Hoàn thành", input: "https://truyenvnhot.com/truyen-hoan-thanh", script: "gen.js" }
    ]);
}