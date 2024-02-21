load('config.js');
function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: BASE_URL + "/truyen-tranh", script: "gen.js" },
        { title: "Truyện Tranh 18+", input: BASE_URL + "/the-loai/truyen-tranh-18", script: "gen.js" },
        { title: "Manhwa", input: BASE_URL + "/the-loai/manhwa", script: "gen.js" },
        { title: "Manhua", input: BASE_URL + "/the-loai/manhua", script: "gen.js" }
    ]);
}