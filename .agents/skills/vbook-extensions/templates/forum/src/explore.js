load('config.js');
function execute() {
    let response = fetch(BASE_URL + "/forums");
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let boards = doc.select("SELECTOR_BOARD_ITEMS").map(function (el) {
        let name = el.select("SELECTOR_BOARD_TITLE").text();
        let href = el.select("SELECTOR_BOARD_TITLE a").attr("href");
        return {
            name: name,
            link: href,
            description: el.select("SELECTOR_BOARD_DESC").text(),
            threads: el.select("SELECTOR_BOARD_THREADS").text(),   // counts as display text
            posts: el.select("SELECTOR_BOARD_POSTS").text(),
            action: { type: "list", name: name, script: "search.js", input: href }
        };
    });

    return Response.success([
        { id: "boards", type: "board_list", title: "Chuyên mục", items: boards },
        // Last section with `script`: keeps loading while search.js returns a non-empty data2.
        { id: "latest", type: "thread_list", title: "Bài mới", script: "search.js", input: "/bai-moi" }
    ]);
}
