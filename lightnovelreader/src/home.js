function execute() {
    return Response.success([
        {title: "New", input: "https://lightnovelreader.me/ranking/new", script: "gen.js"},
        {title: "Top Rated", input: "https://lightnovelreader.me/ranking/top-rated", script: "gen.js"},
        {title: "Most Viewed", input: "https://lightnovelreader.me/ranking/most-viewed", script: "gen.js"},
        {title: "Subscribers", input: "https://lightnovelreader.me/ranking/subscribers", script: "gen.js"}
    ]);
}