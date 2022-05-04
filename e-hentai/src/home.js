function execute() {
    return Response.success([
        {title: "Front Page", input: "https://e-hentai.org", script: "gen.js"},
        {title: "Popular", input: "https://e-hentai.org/popular", script: "gen.js"}
    ]);
}