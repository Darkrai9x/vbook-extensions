function execute() {
    return Response.success([
        {title: "Nổi bật", input: "https://qmanga3.net/danh-muc/noi-bat", script: "gen.js"},
        {title: "Phổ biến", input: "https://qmanga3.net/danh-muc/pho-bien", script: "gen.js"}
    ]);
}