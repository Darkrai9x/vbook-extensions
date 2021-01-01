function execute() {
    return Response.success([
        {title: "Hot nhất", input: "https://www.ngonphong.com/truyen-hot-nhat/", script: "gen.js"},
        {title: "Xem nhiều", input: "https://www.ngonphong.com/nhieu-xem-nhat/", script: "gen.js"},
        {title: "Trọn bộ", input: "https://www.ngonphong.com/tron-bo/", script: "gen.js"}
    ]);
}