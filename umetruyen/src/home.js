function execute() {
    return Response.success([
        {title: "Top ngày", input: "https://umetruyen.net/danh-sach-truyen.html?status=0&sort=views", script: "gen.js"},
        {title: "Mới cập nhật", input: "https://umetruyen.net/danh-sach-truyen.html", script: "gen.js"},
        {title: "Truyện mới", input: "https://umetruyen.net/danh-sach-truyen.html?status=0&sort=id", script: "gen.js"},
        {title: "Truyện full", input: "https://umetruyen.net/truyen-da-hoan-thanh.html", script: "gen.js"}
    ]);
}