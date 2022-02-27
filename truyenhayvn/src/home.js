function execute() {
    return Response.success([
        { title: "Truyện Mới", input: "/danh-sach/truyen-moi", script: "gen.js" },
        { title: "Truyện Hot", input: "/danh-sach/truyen-hot", script: "gen.js" },
        { title: "Truyện Full", input: "/danh-sach/truyen-full", script: "gen.js" },
        { title: "Truyện Full Hot", input: "/danh-sach/truyen-full-hot", script: "gen.js" }
    ]);
}
