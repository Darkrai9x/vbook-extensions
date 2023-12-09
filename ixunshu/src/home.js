function execute() {
    return Response.success([
        {title: "首页", input: "https://ixunshu.net/", script: "top1.js"},
        {title: "人气小说榜", input: "https://ixunshu.net/", script: "top2.js"},
        {title: "最近更新小说列表", input: "https://ixunshu.net/", script: "top3.js"},
    ]);
}