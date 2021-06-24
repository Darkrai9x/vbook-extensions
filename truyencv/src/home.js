function execute() {
    return Response.success([
        {title: "Truyện Mới", script: "gen.js", input: "https://truyencv.com/danh-sach/moi-cap-nhat/"},
        {title: "Hoàn thành", script: "gen.js", input: "https://truyencv.com/danh-sach/hoan-thanh/"},
        {title: "Đề cử", script: "gen.js", input: "https://truyencv.com/danh-sach/truyen-de-cu/"},
        {title: "Sáng tác", script: "gen.js", input: "https://truyencv.com/danh-sach/sang-tac/"},
    ]);
}


