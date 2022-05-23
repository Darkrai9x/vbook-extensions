function execute() {
    return Response.success([
        {title: "Nổi bật", input: "https://qmanga3.com/danh-muc/noi-bat", script: "gen.js"},
        {title: "Phổ biến", input: "https://qmanga3.com/danh-muc/pho-bien", script: "gen.js"}
    ]);
}