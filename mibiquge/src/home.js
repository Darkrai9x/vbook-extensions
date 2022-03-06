function execute() {
    return Response.success([
        {title: "小说书库", input: "https://www.mibiquge.com/lb/", script: "gen.js"},
        {title: "玄幻奇幻", input: "https://www.mibiquge.com/fl/1/", script: "gen.js"},
        {title: "武侠仙侠", input: "https://www.mibiquge.com/fl/2/", script: "gen.js"},
        {title: "都市生活", input: "https://www.mibiquge.com/fl/3/", script: "gen.js"},
        {title: "历史军事", input: "https://www.mibiquge.com/fl/4/", script: "gen.js"},
        {title: "游戏竞技", input: "https://www.mibiquge.com/fl/5/", script: "gen.js"},
        {title: "科幻未来", input: "https://www.mibiquge.com/fl/6/", script: "gen.js"},
        {title: "完本小说", input: "https://www.mibiquge.com/qb/", script: "gen.js"}
    ]);
}