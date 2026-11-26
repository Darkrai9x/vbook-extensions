// A `type: "explore"` tab calls its script as execute(input) and shows explore sections.
function execute() {
    return Response.success([
        { title: "Diễn đàn", input: "", script: "explore.js", type: "explore" },
        { title: "Bài mới", input: "/bai-moi", script: "search.js" },
        { title: "Chủ đề hot", input: "/chu-de-hot", script: "search.js" }
    ]);
}
