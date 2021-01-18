function execute() {
    return Response.success([
        {title: "Mới nhất", input: "https://beeng.net/danh-muc/moi-nhat", script: "gen.js"},
        {title: "Hot", input: "https://beeng.net/danh-muc/dang-hot", script: "gen.js"},
        {title: "Xem nhiều", input: "https://beeng.net/danh-muc/xem-nhieu", script: "gen.js"}
    ]);
}