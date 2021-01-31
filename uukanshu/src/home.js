function execute() {
    return Response.success([
        { title: "玄幻奇幻", input: "/list/xuanhuan", script: "gen.js" },
        { title: "都市言情", input: "/list/yanqing", script: "gen.js" },
        { title: "武侠仙侠", input: "/list/xianxia", script: "gen.js" },
        { title: "军事历史", input: "/list/lishi", script: "gen.js" },
        { title: "网游竞技", input: "/list/wangyou", script: "gen.js" },
        { title: "科幻灵异", input: "/list/lingyi", script: "gen.js" },
        { title: "女生同人", input: "/list/tongren", script: "gen.js" },
        { title: "二次元", input: "/list/erciyuan", script: "gen.js" },
        { title: "全本小说", input: "/list/quanben", script: "gen.js" },
        { title: "排行榜", input: "https://www.uukanshu.com/rank-1-1.html", script: "rank.js" }
    ]);
}