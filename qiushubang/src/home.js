function execute() {
    return Response.success([
        {title: "最近更新", input: "", script: "last_update.js"},
        {title: "最新", input: "", script: "last_add.js"},
        {title: "玄幻小说", input: "/sort/1", script: "gen.js"},
        {title: "奇幻小说", input: "/sort/2", script: "gen.js"},
        {title: "武侠小说", input: "/sort/3", script: "gen.js"},
        {title: "仙侠小说", input: "/sort/4", script: "gen.js"},
        {title: "都市小说", input: "/sort/5", script: "gen.js"},
        {title: "军事小说", input: "/sort/6", script: "gen.js"},
        {title: "历史小说", input: "/sort/7", script: "gen.js"},
        {title: "游戏小说", input: "/sort/8", script: "gen.js"},
        {title: "竞技小说", input: "/sort/9", script: "gen.js"},
        {title: "科幻小说", input: "/sort/10", script: "gen.js"},
        {title: "悬疑小说", input: "/sort/11", script: "gen.js"},
    ]);
}