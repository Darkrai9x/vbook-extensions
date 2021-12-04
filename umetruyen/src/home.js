function execute() {
    return Response.success([
        {title: "Mới cập nhật", input: "https://umetruyen.net", script: "cat.js"},
        {title: "Manhwa", input: "https://umetruyen.net/genre/manhwa", script: "gen.js"},
        {title: "Manga", input: "https://umetruyen.net/genre/manga", script: "gen.js"},
        {title: "Manhua", input: "https://umetruyen.net/genre/manhua", script: "gen.js"},
        {title: "Romance", input: "https://umetruyen.net/genre/romance", script: "gen.js"}
    ]);
}