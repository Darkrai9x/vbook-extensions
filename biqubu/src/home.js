function execute() {
    return Response.success([
        {title: "首页", input: "/", script: "gen.js"},
        {title: "玄幻小说", input: "/xuanhuan/", script: "gen.js"},
        {title: "修真小说", input: "/xiuzhen/", script: "gen.js"},
        {title: "都市小说", input: "/dushi/", script: "gen.js"},
        {title: "历史小说", input: "/lishi/", script: "gen.js"},
        {title: "网游小说", input: "/wangyou/", script: "gen.js"},
        {title: "科幻小说", input: "/kehuan/", script: "gen.js"},
        {title: "言情小说", input: "/yanqing/", script: "gen.js"},
        {title: "其他小说", input: "/qita/", script: "gen.js"}
    ]);
}