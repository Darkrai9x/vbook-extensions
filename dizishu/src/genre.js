load('config.js');
function execute() {
    return Response.success([
        {title: "玄幻奇幻", script: "gen.js", input: BASE_URL + "/leibie1"},
        {title: "武侠仙侠", script: "gen.js", input: BASE_URL + "/leibie2"},
        {title: "都市娱乐", script: "gen.js", input: BASE_URL + "/leibie3"},
        {title: "历史军事", script: "gen.js", input: BASE_URL + "/leibie4"},
        {title: "网游竞技", script: "gen.js", input: BASE_URL + "/leibie5"},
        {title: "科幻灵异", script: "gen.js", input: BASE_URL + "/leibie6"},
        {title: "女生言情", script: "gen.js", input: BASE_URL + "/leibie7"},
        {title: "N次元", script: "gen.js", input: BASE_URL + "/leibie8"},
        {title: "其他类型", script: "gen.js", input: BASE_URL + "/leibie9"}
    ]);
}