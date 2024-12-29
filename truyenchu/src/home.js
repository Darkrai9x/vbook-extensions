load('config.js');
function execute() {
    return Response.success([
        {title: "Hot", input: BASE_URL + "/danh-sach/truyen-hot", script: "hot.js"},
        {title: "Mới cập nhật", input: BASE_URL + "/the-loai?sort=moi-cap-nhat", script: "gen.js"},
        {title: "Hoàn thành", input: BASE_URL + "/danh-sach/truyen-full", script: "gen.js"},
    ]);
}
