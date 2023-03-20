function execute() {
    return Response.success([
        {title: "更新时间", input: "https://www.shubl.com/index/book_list/0/0/uptime/0/0/0", script: "gen.js"},
        {title: "总推荐", input: "https://www.shubl.com/index/book_list/0/0/total_recommend/0/0/0", script: "gen.js"},
        {title: "纯爱", input: "https://www.shubl.com/index/book_list/1/0/week_click/0/0/0", script: "gen.js"},
        {title: "言情", input: "https://www.shubl.com/index/book_list/20/0/week_click/0/0/0", script: "gen.js"},
        {title: "百合", input: "https://www.shubl.com/index/book_list/3/0/week_click/0/0/0", script: "gen.js"},
        {title: "无cp", input: "https://www.shubl.com/index/book_list/21/0/week_click/0/0/0", script: "gen.js"}
    ]);
}