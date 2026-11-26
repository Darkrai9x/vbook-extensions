// A `type: "explore"` tab calls its script as execute(input) and shows explore sections.
function execute() {
    return Response.success([
        { title: "Trang chủ", input: "", script: "explore.js", type: "explore" },
        { title: "Mới nhất", input: "/tin-moi", script: "search.js" },
        { title: "Nổi bật", input: "/noi-bat", script: "search.js" }
    ]);
}
