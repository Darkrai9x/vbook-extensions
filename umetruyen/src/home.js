function execute() {
    return Response.success([
        {title: "Mới cập nhật", input: "https://umetruyen.org", script: "cat.js"},
        {title: "Manhwa", input: "https://umetruyen.org/genre/manhwa", script: "gen.js"},
        {title: "Manga", input: "https://umetruyen.org/genre/manga", script: "gen.js"},
        {title: "Manhua", input: "https://umetruyen.org/genre/manhua", script: "gen.js"},
        {title: "Romance", input: "https://umetruyen.org/genre/romance", script: "gen.js"}
    ]);
}