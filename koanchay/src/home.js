function execute() {
    return Response.success([
        {title: "Chương mới", script: "gen.js", input: "https://koanchay.info/chuong-moi"},
        {title: "Bảng xếp hạng", script: "gen.js", input: "https://koanchay.info/bang-xep-hang"}
    ]);
}