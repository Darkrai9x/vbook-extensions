function execute() {
    return Response.success([
        {title: "Tất cả", input: "https://nuhiep.com/truyen?", script: "gen.js"},
        {title: "Hiện Đại Ngôn Tình", input: "https://nuhiep.com/truyen?genre=10", script: "gen.js"},
        {title: "Huyền Huyễn Ngôn Tình", input: "https://nuhiep.com/truyen?genre=13", script: "gen.js"},
        {title: "Tiên Hiệp Kỳ Duyên", input: "https://nuhiep.com/truyen?genre=14", script: "gen.js"},
        {title: "Cổ Đại Ngôn Tình", input: "https://nuhiep.com/truyen?genre=15", script: "gen.js"},
        {title: "Huyền Nghi Thần Quái", input: "https://nuhiep.com/truyen?genre=16", script: "gen.js"},
        {title: "Khoa Huyễn Không Gian", input: "https://nuhiep.com/truyen?genre=17", script: "gen.js"},
        {title: "Lãng Mạn Thanh Xuân", input: "https://nuhiep.com/truyen?genre=18", script: "gen.js"}
    ]);
}