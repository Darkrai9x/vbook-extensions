function execute() {
    return Response.success([
        {title: "Mới nhất", input: "https://beeng.net/truyen-tranh-noi-bat/moi-nhat", script: "gen.js"},
        {title: "Hot", input: "https://beeng.net/truyen-tranh-noi-bat/dang-hot", script: "gen.js"},
        {title: "Xem nhiều", input: "https://beeng.net/truyen-tranh-noi-bat/xem-nhieu", script: "gen.js"}
    ]);
}