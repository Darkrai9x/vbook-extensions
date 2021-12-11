function execute() {
    return Response.success([
        {title: "Nổi bật", input: "https://qmanga2.net/danh-muc/noi-bat", script: "gen.js"},
        {title: "Phổ biến", input: "https://qmanga2.net/danh-muc/pho-bien", script: "gen.js"}
    ]);
}