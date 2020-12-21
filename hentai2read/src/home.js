function execute() {
    return Response.success([
        {title: "Mới nhất", input: "https://hentai2read.com/hentai-list/all/any/all/last-added", script: "gen.js"},
        {title: "Trending", input: "https://hentai2read.com/hentai-list/all/any/all/trending", script: "gen.js"},
        {title: "Xem nhiều", input: "https://hentai2read.com/hentai-list/all/any/all/most-popular", script: "gen.js"}
    ]);
}