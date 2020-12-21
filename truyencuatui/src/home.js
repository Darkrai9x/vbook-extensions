function execute() {
    return Response.success([
        {title: "Truyện Mới", input: "https://truyencuatui.net/truyen-moi.html", script: "gen.js"},
        {title: "Truyện Full", input: "https://truyencuatui.net/truyen-hoan-thanh.html", script: "gen.js"},
        {title: "Truyện Dịch", input: "https://truyencuatui.net/truyen-dich.html", script: "gen.js"},
        {title: "Truyện Hot", input: "https://truyencuatui.net/truyen-hot.html", script: "gen.js"}
    ]);
}