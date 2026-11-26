// A `type: "explore"` tab calls its script as execute(input) and shows explore sections.
function execute() {
    return Response.success([
        { title: "Trang chủ", input: "", script: "explore.js", type: "explore" },
        { title: "Mới cập nhật", input: "/moi-cap-nhat", script: "search.js" },
        { title: "Album", input: "/album", script: "search.js" },
        { title: "Bài hát", input: "/bai-hat", script: "search.js" },
        { title: "Nghe nhiều", input: "/nghe-nhieu", script: "search.js" }
    ]);
}
