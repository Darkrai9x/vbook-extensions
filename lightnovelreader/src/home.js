function execute() {
    return Response.success([
        {title: "New", input: "/ranking/new", script: "gen.js"},
        {title: "Top Rated", input: "/ranking/top-rated", script: "gen.js"},
        {title: "Most Viewed", input: "/ranking/most-viewed", script: "gen.js"},
        {title: "Subscribers", input: "/ranking/subscribers", script: "gen.js"}
    ]);
}