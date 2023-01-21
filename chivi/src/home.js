function execute() {
    return Response.success([
        {title: "Vừa xem", input: "https://chivi.app/_db/books?", script: "gen.js"},
        {title: "Đổi mới", input: "https://chivi.app/_db/books?order=update", script: "gen.js"},
        {title: "Đánh giá", input: "https://chivi.app/_db/books?order=rating", script: "gen.js"},
        {title: "Tổng hợp", input: "https://chivi.app/_db/books?order=weight", script: "gen.js"}
    ]);
}