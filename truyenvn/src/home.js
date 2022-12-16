function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: "/danh-sach-truyen", script: "gen.js" },
        { title: "Truyện Tranh 18+", input: "/the-loai/adult", script: "gen.js" },
        { title: "Truyện Hot", input: "/truyen-hot", script: "gen.js" },
        { title: "Hoàn thành", input: "/truyen-hoan-thanh", script: "gen.js" }
    ]);
}