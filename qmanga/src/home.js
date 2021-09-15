function execute() {
    return Response.success([
        {title: "Nổi bật", input: "https://qmanga.co/danh-muc/noi-bat", script: "gen.js"},
        {title: "Phổ biến", input: "https://qmanga.co/danh-muc/pho-bien", script: "gen.js"}
    ]);
}