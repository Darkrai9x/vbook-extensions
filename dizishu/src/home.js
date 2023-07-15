load('config.js');
function execute() {
    return Response.success([
        {title: "日排行榜", script: "rank.js", input: BASE_URL + "/dayvisit"},
        {title: "周排行榜", script: "rank.js", input: BASE_URL + "/weekvisit"},
        {title: "月排行榜", script: "rank.js", input: BASE_URL + "/monthvisit"},
        {title: "总排行榜", script: "rank.js", input: BASE_URL + "/allvisit"},
        {title: "完本小说", script: "gen.js", input: BASE_URL + "/finish"}
    ]);
}