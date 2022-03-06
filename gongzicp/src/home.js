function execute() {
    return Response.success([
        {title: "古代", input: "https://webapi.gongzicp.com/home/initPcType?id=3", script: "gen.js"},
        {title: "现代", input: "https://webapi.gongzicp.com/home/initPcType?id=1", script: "gen.js"},
        {title: "幻想", input: "https://webapi.gongzicp.com/home/initPcType?id=4", script: "gen.js"},
        {title: "悬疑", input: "https://webapi.gongzicp.com/home/initPcType?id=6", script: "gen.js"},
        {title: "短佩", input: "https://webapi.gongzicp.com/home/initPcType?id=66", script: "gen.js"},
        {title: "架空", input: "https://webapi.gongzicp.com/home/initPcType?id=9", script: "gen.js"},
        {title: "百合", input: "https://webapi.gongzicp.com/home/initPcType?id=17", script: "gen.js"}
    ]);
}