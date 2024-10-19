load('config.js');

function execute() {
    return Response.success([
        {title: "Vừa đăng", input: BASE_URL + "/truyen-moi-dang", script: "gen.js"},
        {title: "Xem nhiều", input: BASE_URL + "/truyen-duoc-xem-nhieu-nhat", script: "gen.js"},
        {title: "Mới cập nhật", input: BASE_URL + "/all", script: "gen.js"}
    ]);
}