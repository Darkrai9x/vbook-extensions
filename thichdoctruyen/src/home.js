load('config.js');

function execute() {
    return Response.success([
        {title: "Truyện mới", script: "gen.js", input: BASE_URL + "/the-loai/truyen-moi"},
        {title: "Truyện hot", script: "gen.js", input: BASE_URL + "/the-loai/truyen-hot"},
        {title: "Truyện full", script: "gen.js", input: BASE_URL + "/the-loai/truyen-full"},
        {title: "Ngôn tình", script: "gen.js", input: BASE_URL + "/the-loai/ngon-tinh"},
        {title: "Truyện teen", script: "gen.js", input: BASE_URL + "/the-loai/truyen-teen"}
    ]);
}
