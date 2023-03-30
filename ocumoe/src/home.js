load('config.js');

function execute() {
    return Response.success([
        {title: "Hot nhất", input: BASE_URL + "/truyen-hot-nhat/", script: "gen.js"},
        {title: "Xem nhiều", input: BASE_URL + "/xem-nhieu-nhat/", script: "gen.js"},
        {title: "Trọn bộ", input: BASE_URL + "/tron-bo/", script: "gen.js"}
    ]);
}