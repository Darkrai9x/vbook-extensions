function execute() {
    return Response.success([
        {title: "Ngôn tình", input: "https://umetruyen.com/danh-sach-truyen-the-loai-Ng%C3%B4n%20T%C3%ACnh.html", script: "gen.js"},
        {title: "Đam mỹ", input: "https://umetruyen.com/danh-sach-truyen-the-loai-%C4%90am%20M%E1%BB%B9.html", script: "gen.js"},
        {title: "Action", input: "https://umetruyen.com/danh-sach-truyen-the-loai-action.html", script: "gen.js"},
        {title: "Truyện full", input: "https://umetruyen.com/truyen-da-hoan-thanh.html", script: "gen.js"}
    ]);
}