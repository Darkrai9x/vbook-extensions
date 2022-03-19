function execute() {
    return Response.success([
        {title: "New", input: "https://lightnovelreader.org/ranking/new", script: "gen.js"},
        {title: "Top Rated", input: "https://lightnovelreader.org/ranking/top-rated", script: "gen.js"},
        {title: "Most Viewed", input: "https://lightnovelreader.org/ranking/most-viewed", script: "gen.js"},
        {title: "Subscribers", input: "https://lightnovelreader.org/ranking/subscribers", script: "gen.js"}
    ]);
}