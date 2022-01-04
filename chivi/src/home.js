function execute() {
    return Response.success([
        {title: "Vừa xem", input: "https://chivi.app/api/books?", script: "gen.js"},
        {title: "Đổi mới", input: "https://chivi.app/api/books?order=update", script: "gen.js"},
        {title: "Đánh giá", input: "https://chivi.app/api/books?order=rating", script: "gen.js"},
        {title: "Tổng hợp", input: "https://chivi.app/api/books?order=weight", script: "gen.js"}
    ]);
}