function execute() {
    return Response.success([
        {title: "Truyện mới đăng", input: "http://santruyen.com/truyen-moi-dang/", script: "gen.js"},
        {title: "Truyện mới cập nhật", input: "http://santruyen.com/truyen-moi-cap-nhat/", script: "gen.js"},
        {title: "Ngôn full", input: "http://santruyen.com/truyen-full/", script: "gen.js"},
        {title: "Truyện ngắn", input: "http://santruyen.com/truyen-ngan/", script: "gen.js"},
        {title: "Truyện tự sáng tác", input: "http://santruyen.com/truyen-tu-sang-tac/", script: "gen.js"}
    ]);
}