load('config.js');
function execute() {
    return Response.success([
        {title: "Truyện mới", input: BASE_URL + "/danh-sach.html", script: "gen.js"},
        {title: "Chương mới", input: BASE_URL + "/chap-moi.html", script: "gen.js"},
        {title: "Full màu", input: BASE_URL + "/the-loai-37-full_color.html", script: "gen.js"},
        {title: "Không che", input: BASE_URL + "/the-loai-99-khong_che.html", script: "gen.js"}
    ]);
}