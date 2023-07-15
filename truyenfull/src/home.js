load('config.js');
function execute() {
    return Response.success([
        {title: "Truyện mới cập nhật", input: BASE_URL + "/danh-sach/truyen-moi/", script: "gen.js"},
        {title: "Truyện Hot", input: BASE_URL + "/danh-sach/truyen-hot/", script: "gen.js"},
        {title: "Truyện Full", input: BASE_URL + "/danh-sach/truyen-full/", script: "gen.js"},
        {title: "Tiên Hiệp Hay", input: BASE_URL + "/danh-sach/tien-hiep-hay/", script: "gen.js"},
        {title: "Kiếm Hiệp Hay", input: BASE_URL + "/danh-sach/kiem-hiep-hay/", script: "gen.js"},
        {title: "Truyện Teen Hay", input: BASE_URL + "/danh-sach/truyen-teen-hay/", script: "gen.js"},
        {title: "Ngôn Tình Hay", input: BASE_URL + "/danh-sach/ngon-tinh-hay/", script: "gen.js"},
        {title: "Ngôn Tình Sắc", input: BASE_URL + "/danh-sach/ngon-tinh-sac/", script: "gen.js"},
        {title: "Ngôn Tình Ngược", input: BASE_URL + "/danh-sach/ngon-tinh-nguoc/", script: "gen.js"},
        {title: "Ngôn Tình Sủng", input: BASE_URL + "/danh-sach/ngon-tinh-sung/", script: "gen.js"},
        {title: "Ngôn Tình Hài", input: BASE_URL + "/danh-sach/ngon-tinh-hai/", script: "gen.js"},
        {title: "Đam Mỹ Hài", input: BASE_URL + "/danh-sach/dam-my-hai/", script: "gen.js"},
        {title: "Đam Mỹ Hay", input: BASE_URL + "/danh-sach/dam-my-hay/", script: "gen.js"},
        {title: "Đam Mỹ H Văn", input: BASE_URL + "/danh-sach/dam-my-h-van/", script: "gen.js"},
        {title: "Đam Mỹ Sắc", input: BASE_URL + "/danh-sach/dam-my-sac/", script: "gen.js"}
    ]);
}
