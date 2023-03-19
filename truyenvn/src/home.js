load('config.js');
function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: BASE_URL + "/danh-sach-truyen", script: "gen.js" },
        { title: "Truyện Tranh 18+", input: BASE_URL + "/the-loai/adult", script: "gen.js" },
        { title: "Truyện Hot", input: BASE_URL + "/truyen-hot", script: "gen.js" },
        { title: "Hoàn thành", input: BASE_URL + "/truyen-hoan-thanh", script: "gen.js" }
    ]);
}