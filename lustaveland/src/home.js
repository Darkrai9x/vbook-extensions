function execute() {
    return Response.success([
        {title: "Mới cập nhật (Chữ)", input: "https://lustaveland.com/danh-sach-chuong-moi-cap-nhat/novel", script: "gen.js"},
        {title: "Mới cập nhật (Tranh)", input: "https://lustaveland.com/danh-sach-chuong-moi-cap-nhat", script: "gen.js"},
        {title: "Mới đăng (Chữ)", input: "https://lustaveland.com/danh-sach-moi-dang/novel", script: "gen.js"},
        {title: "Truyện full (Chữ)", input: "https://lustaveland.com/danh-sach-truyen-full/novel", script: "gen.js"},
        {title: "Truyện full (Tranh)", input: "https://lustaveland.com/danh-sach-truyen-full/comic", script: "gen.js"},
    ]);
}
