function execute() {
    return Response.success([
        {title: "New", input: "https://readmanga.org/ranking/new", script: "gen.js"},
        {title: "Top Rated", input: "https://readmanga.org/ranking/top-rated", script: "gen.js"},
        {title: "Most Viewed", input: "https://readmanga.org/ranking/most-viewed", script: "gen.js"},
        {title: "Subscribers", input: "https://readmanga.org/ranking/subscribers", script: "gen.js"}
    ]);
}