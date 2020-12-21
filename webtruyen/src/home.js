function execute() {
    return Response.success([
        { title: "Vừa đăng", input: "https://webtruyen.com/truyen-moi-dang", script: "gen.js" },
        { title: "Xem nhiều", input: "https://webtruyen.com/truyen-duoc-xem-nhieu-nhat", script: "gen.js" },
        { title: "Mới cập nhật", input: "https://webtruyen.com/all", script: "gen.js" }
    ]);
}