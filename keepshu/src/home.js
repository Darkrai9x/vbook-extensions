function execute() {
    return Response.success([
        {title: "玄幻奇幻", input: "https://www.keepshu.com/xuanhuan", script: "gen.js"},
        {title: "武侠仙侠", input: "https://www.keepshu.com/wuxia", script: "gen.js"},
        {title: "网游竞技", input: "https://www.keepshu.com/youxi", script: "gen.js"},
        {title: "都市人生", input: "https://www.keepshu.com/dushi", script: "gen.js"},
        {title: "侦探推理", input: "https://www.keepshu.com/zhentan", script: "gen.js"},
        {title: "历史军事", input: "https://www.keepshu.com/lishi", script: "gen.js"},
        {title: "科幻小说", input: "https://www.keepshu.com/kehuan", script: "gen.js"},
        {title: "女生小说", input: "https://www.keepshu.com/nvsheng", script: "gen.js"},
        {title: "其他小说", input: "https://www.keepshu.com/qita", script: "gen.js"}
    ]);
}