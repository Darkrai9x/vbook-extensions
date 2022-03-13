function execute() {
    return Response.success([
        {title: "玄幻小说", input: "http://m.shubao45.com/sort/1_1/", script: "gen.js"},
        {title: "修真小说", input: "http://m.shubao45.com/sort/2_1/", script: "gen.js"},
        {title: "都市小说", input: "http://m.shubao45.com/sort/3_1/", script: "gen.js"},
        {title: "穿越小说", input: "http://m.shubao45.com/sort/4_1/", script: "gen.js"},
        {title: "藏经阁", input: "http://m.shubao45.com/sort/5_1/", script: "gen.js"},
        {title: "科幻小说", input: "http://m.shubao45.com/sort/6_1/", script: "gen.js"},
        {title: "其他小说", input: "http://m.shubao45.com/sort/7_1/", script: "gen.js"}
    ]);
}