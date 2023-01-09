function execute() {
    return Response.success([
        {title: "Nổi bật", input: "/danh-muc/noi-bat", script: "gen.js"},
        {title: "Phổ biến", input: "/danh-muc/pho-bien", script: "gen.js"}
    ]);
}