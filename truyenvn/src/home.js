function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: "https://truyenvnhot.net/danh-sach-truyen", script: "gen.js" },
        { title: "Truyện Tranh 18+", input: "https://truyenvnhot.net/the-loai/adult", script: "gen.js" },
        { title: "Truyện Hot", input: "https://truyenvnhot.net/truyen-hot", script: "gen.js" },
        { title: "Hoàn thành", input: "https://truyenvnhot.net/truyen-hoan-thanh", script: "gen.js" }
    ]);
}