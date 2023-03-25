function execute() {
    return Response.success([
        {title: "日排行榜", script: "rank.js", input: "https://www.dizishu.com/dayvisit"},
        {title: "周排行榜", script: "rank.js", input: "https://www.dizishu.com/weekvisit"},
        {title: "月排行榜", script: "rank.js", input: "https://www.dizishu.com/monthvisit"},
        {title: "总排行榜", script: "rank.js", input: "https://www.dizishu.com/allvisit"},
        {title: "完本小说", script: "gen.js", input: "https://www.dizishu.com/finish"}
    ]);
}