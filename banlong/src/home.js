load("config.js");

function execute() {
    return Response.success([
        {title: "Top linh phiếu", input: BASE_URL + "/top-linh-phieu-tuan", script: "source.js"},
        {title: "Mới nhất", input: BASE_URL + "/truyen-moi-nhat", script: "source.js"},
        {title: "Mới cập nhật", input: BASE_URL + "/chuong-moi-cap-nhat", script: "newchap.js"},
        {title: "Top yêu thích", input: BASE_URL + "/truyen-yeu-thich", script: "source.js"},
        {title: "Truyện hot", input: BASE_URL + "/truyen-hot", script: "source.js"},
        {title: "Thịnh hành tuần", input: BASE_URL + "/truyen-thinh-hanh-trong-tuan", script: "newchap.js"},
        {title: "Hoàn thành", input: BASE_URL + "/truyen-hoan-thanh", script: "source.js"}
    ]);
}