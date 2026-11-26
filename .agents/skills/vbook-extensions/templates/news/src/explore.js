load('config.js');
function execute() {
    let response = fetch(BASE_URL);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let topItems = doc.select("SELECTOR_TOP_ARTICLES").map(function (el) {
        return {
            name: el.select("SELECTOR_ITEM_NAME").text(),
            cover: el.select("SELECTOR_ITEM_COVER img").attr("src"),
            link: el.select("SELECTOR_ITEM_LINK a").attr("href"),
            description: el.select("SELECTOR_ITEM_LEAD").text(),
            time: el.select("SELECTOR_ITEM_TIME").text()
        };
    });

    return Response.success([
        // news_hero: first item as a wide card, the rest as rows.
        { id: "top", type: "news_hero", title: "Tiêu điểm", items: topItems },
        // Last section with `script`: keeps loading while search.js returns a non-empty data2.
        { id: "latest", type: "news_list", title: "Mới nhất", script: "search.js", input: "/tin-moi" }
    ]);
}
