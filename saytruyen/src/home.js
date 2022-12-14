function execute() {
    return Response.success([
        {title: "Mới cập nhật", input: "https://saytruyenvip.com", script: "cat.js"},
        {title: "Manhwa", input: "https://saytruyenvip.com/genre/manhwa", script: "gen.js"},
        {title: "Manga", input: "https://saytruyenvip.com/genre/manga", script: "gen.js"},
        {title: "Manhua", input: "https://saytruyenvip.com/genre/manhua", script: "gen.js"},
        {title: "Romance", input: "https://saytruyenvip.com/genre/romance", script: "gen.js"}
    ]);
}