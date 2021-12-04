function execute() {
    return Response.success([
        {title: "Mới cập nhật", input: "https://saytruyen.net", script: "cat.js"},
        {title: "Manhwa", input: "https://saytruyen.net/genre/manhwa", script: "gen.js"},
        {title: "Manga", input: "https://saytruyen.net/genre/manga", script: "gen.js"},
        {title: "Manhua", input: "https://saytruyen.net/genre/manhua", script: "gen.js"},
        {title: "Romance", input: "https://saytruyen.net/genre/romance", script: "gen.js"}
    ]);
}