load('config.js');
function execute() {
    return Response.success([
        {title: "Mới cập nhật", input: BASE_URL + "/api/v2/mangas/recently_updated", script: "gen.js"},
        {title: "Nổi bật", input: BASE_URL + "/api/v2/mangas/top?duration=all", script: "gen.js"},
        {title: "Nổi bật tuần", input: BASE_URL + "/api/v2/mangas/top?duration=week", script: "gen.js"},
        {title: "Nổi bật tháng", input: BASE_URL + "/api/v2/mangas/top?duration=month", script: "gen.js"},
    ]);
}