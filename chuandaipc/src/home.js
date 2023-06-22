load("config.js");
function execute() {
    return Response.success([
        {title: "最近更新", input: BASE_URL + "/sort", script: "gen.js"},
        {title: "玄幻小说", input: BASE_URL + "/sort/1", script: "gen.js"},
        {title: "仙侠小说", input: BASE_URL + "/sort/2", script: "gen.js"},
        {title: "都市小说", input: BASE_URL + "/sort/3", script: "gen.js"},
        {title: "历史军事", input: BASE_URL + "/sort/4", script: "gen.js"},
        {title: "游戏竞技", input: BASE_URL + "/sort/5", script: "gen.js"},
        {title: "科幻小说", input: BASE_URL + "/sort/6", script: "gen.js"},
        {title: "恐怖小说", input: BASE_URL + "/sort/7", script: "gen.js"},
        {title: "其他类型", input: BASE_URL + "/sort/8", script: "gen.js"},
    ]);
}