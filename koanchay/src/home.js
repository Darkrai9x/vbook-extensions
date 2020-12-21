function execute() {
    return Response.success([
        {title: "Chương mới", script: "gen.js", input: "https://koanchay.com/chuong-moi"},
        {title: "Bảng xếp hạng", script: "gen.js", input: "https://koanchay.com/bang-xep-hang"}
    ]);
}