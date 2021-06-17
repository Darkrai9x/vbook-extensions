function execute() {
    return Response.success([
        { title: "Vừa đăng", input: "https://dtruyen.com/truyen-moi-dang", script: "gen.js" },
        { title: "Xem nhiều", input: "https://dtruyen.com/truyen-duoc-xem-nhieu-nhat", script: "gen.js" },
        { title: "Mới cập nhật", input: "https://dtruyen.com/all", script: "gen.js" }
    ]);
}