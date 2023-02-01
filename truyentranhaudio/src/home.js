function execute() {
    return Response.success([
        {title: "Danh sách truyện", input: "https://truyentranhaudio.org", script: "gen.js"}
    ]);
}