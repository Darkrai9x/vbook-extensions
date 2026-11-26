load('config.js');
// Section data already in this page -> `items`; data on another page -> `script` + `input` (loads on its own).
function execute() {
    let response = fetch(BASE_URL);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let bannerItems = doc.select("SELECTOR_BANNER_SLIDES").map(function (el) {
        return {
            name: el.select("SELECTOR_BANNER_TITLE").text(),
            cover: el.select("SELECTOR_BANNER_IMAGE img").attr("src"),
            link: el.select("SELECTOR_BANNER_LINK a").attr("href")
        };
    });

    let latestItems = doc.select("SELECTOR_/moi-cap-nhat_ITEMS").map(function (el) {
        return {
            name: el.select("SELECTOR_ITEM_NAME").text(),
            cover: el.select("SELECTOR_ITEM_COVER img").attr("src"),
            link: el.select("SELECTOR_ITEM_LINK a").attr("href"),
            description: el.select("SELECTOR_ITEM_DESC").text(),
            tag: el.select("SELECTOR_ITEM_STATUS").text()
        };
    });

    return Response.success([
        { id: "banner", type: "banner", items: bannerItems },
        {
            id: "latest", type: "grid", title: "Mới cập nhật", subtitle: "Album vừa phát hành",
            items: latestItems,
            more: { type: "list", name: "Mới cập nhật", script: "search.js", input: "/moi-cap-nhat" }
        },
        {
            id: "ranking", type: "ranking", title: "Nghe nhiều",
            script: "search.js", input: "/nghe-nhieu",   // called as execute(input, "")
            more: { type: "list", name: "Nghe nhiều", script: "search.js", input: "/nghe-nhieu" }
        }
        // A LAST grid/list section with `script` whose script returns a non-empty data2 scrolls endlessly:
        // { id: "feed", type: "grid", title: "Mới cập nhật", script: "search.js", input: "/moi-cap-nhat" }
    ]);
}
