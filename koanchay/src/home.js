load("config.js");

function execute() {
    return Response.success([
        {title: "Chương mới", script: "gen.js", input: BASE_URL + "/chuong-moi"},
        {title: "Bảng xếp hạng", script: "gen.js", input: BASE_URL + "/bang-xep-hang"}
    ]);
}