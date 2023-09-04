load('config.js');
function execute() {
    return Response.success([
        {
            title: "Tiêu điểm",
            script: "news.js",
            input: BASE_URL + "/thumb"
        },
        {
            title: "Đủ bộ",
            script: "gen.js",
            input: "0"
        },
        {
            title: "Con gái",
            script: "gen.js",
            input: "29"
        },
        {
            title: "Con trai",
            script: "gen.js",
            input: "31"
        }
    ]);
}
