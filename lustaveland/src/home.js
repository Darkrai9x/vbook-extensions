load('config.js');
function execute() {
    return Response.success([
        {title: "Mới cập nhật", input: BASE_URL + "/danh-sach-chuong-moi-cap-nhat/novel", script: "gen.js"},
        {title: "Mới hoàn", input: BASE_URL + "/danh-sach-truyen-full/novel", script: "gen.js"},
        {title: "Mới đăng", input: BASE_URL + "/danh-sach-moi-dang/novel", script: "gen.js"},
    ]);
}
