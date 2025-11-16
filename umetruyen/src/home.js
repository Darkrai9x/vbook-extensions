function execute() {
    return Response.success([
        {title: "Mới cập nhật", input: "", script: "cat.js"},
        {title: "Manhwa", input: "/genre/manhwa", script: "gen.js"},
        {title: "Manga", input: "/genre/manga", script: "gen.js"},
        {title: "Manhua", input: "/genre/manhua", script: "gen.js"},
        {title: "Romance", input: "/genre/romance", script: "gen.js"}
    ]);
}