function execute() {
    return Response.success([
        {title: "Vừa xem", input: "https://chivi.xyz/api/books?order=access", script: "gen.js"},
        {title: "Đổi mới", input: "https://chivi.xyz/api/books?order=update", script: "gen.js"},
        {title: "Đánh giá", input: "https://chivi.xyz/api/books?order=voters", script: "gen.js"},
        {title: "Tổng hợp", input: "https://chivi.xyz/api/books?order=weight", script: "gen.js"}
    ]);
}