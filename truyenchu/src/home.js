load('config.js');
function execute() {
    return Response.success([
        {title: "Hot", input: BASE_URL + "/danh-sach/truyen-hot", script: "gen.js"},
        {title: "Mới", input: BASE_URL + "/danh-sach/truyen-moi", script: "gen.js"},
        {title: "Convert", input: BASE_URL + "/danh-sach/truyen-convert", script: "gen.js"},
        {title: "Dịch", input: BASE_URL + "/danh-sach/truyen-dich", script: "gen.js"},
        {title: "Hoàn thành", input: BASE_URL + "/danh-sach/truyen-full", script: "gen.js"},
    ]);
}
