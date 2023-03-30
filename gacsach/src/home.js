load('config.js');
function execute() {
    return Response.success([
        {
            title: "Mới cập nhật",
            script: "news.js",
            input: BASE_URL
        }
    ])
}

