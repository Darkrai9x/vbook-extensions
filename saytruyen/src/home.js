function execute() {
    return Response.success([
        {title: "Mới cập nhật", input: "https://saytruyen.tv", script: "cat.js"},
        {title: "Manhwa", input: "https://saytruyen.tv/genre/manhwa", script: "gen.js"},
        {title: "Manga", input: "https://saytruyen.tv/genre/manga", script: "gen.js"},
        {title: "Manhua", input: "https://saytruyen.tv/genre/manhua", script: "gen.js"},
        {title: "Romance", input: "https://saytruyen.tv/genre/romance", script: "gen.js"}
    ]);
}