function execute() {
    return Response.success([
        {title: "最近更新", input: "http://www.qiushubang.me/all/0_lastupdate_0_0_0_0_0_0_1.html", script: "gen.js"},
        {title: "最新入库", input: "http://www.qiushubang.me/all/0_postdate_0_0_0_0_0_0_1.html", script: "gen.js"},
        {title: "总点击", input: "http://www.qiushubang.me/all/0_allvisit_0_0_0_0_0_0_1.html", script: "gen.js"},
        {title: "月点击", input: "http://www.qiushubang.me/all/0_monthvisit_0_0_0_0_0_0_1.html", script: "gen.js"},
        {title: "周点击", input: "http://www.qiushubang.me/all/0_weekvisit_0_0_0_0_0_0_1.html", script: "gen.js"},
        {title: "日点击", input: "http://www.qiushubang.me/all/0_dayvisit_0_0_0_0_0_0_1.html", script: "gen.js"},
        {title: "总推荐", input: "http://www.qiushubang.me/all/0_allvote_0_0_0_0_0_0_1.html", script: "gen.js"},
        {title: "月推荐", input: "http://www.qiushubang.me/all/0_monthvote_0_0_0_0_0_0_1.html", script: "gen.js"},
        {title: "周推荐", input: "http://www.qiushubang.me/all/0_weekvote_0_0_0_0_0_0_1.html", script: "gen.js"},
        {title: "日推荐", input: "http://www.qiushubang.me/all/0_dayvote_0_0_0_0_0_0_1.html", script: "gen.js"},
        {title: "总收藏", input: "http://www.qiushubang.me/all/0_goodnum_0_0_0_0_0_0_1.html", script: "gen.js"}
    ]);
}