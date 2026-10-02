load('config.js');
// explore.js — sectioned discover page: a banner carousel + one or more rows.
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

    let latestItems = doc.select("SELECTOR_LATEST_ITEMS").map(function (el) {
        return {
            name: el.select("SELECTOR_ITEM_NAME").text(),
            cover: el.select("SELECTOR_ITEM_COVER img").attr("src"),
            link: el.select("SELECTOR_ITEM_LINK a").attr("href"),
            description: el.select("SELECTOR_ITEM_DESC").text(),
            tag: el.select("SELECTOR_ITEM_STATUS").text()
        };
    });

    let rankingItems = doc.select("SELECTOR_RANKING_ITEMS").map(function (el) {
        return {
            name: el.select("SELECTOR_ITEM_NAME").text(),
            cover: el.select("SELECTOR_ITEM_COVER img").attr("src"),
            link: el.select("SELECTOR_ITEM_LINK a").attr("href"),
            description: el.select("SELECTOR_ITEM_DESC").text()
        };
    });

    return Response.success([
        {
            id: "banner",
            title: "",
            subtitle: "",
            type: "banner",
            items: bannerItems
        },
        {
            id: "latest",
            title: "Mới cập nhật",
            subtitle: "Phim vừa cập nhật tập mới",
            type: "grid",
            items: latestItems,
            more: { type: "list", name: "Danh sách", script: "search.js", input: "/phim-moi-cap-nhat", data: "" }
        },
        {
            id: "ranking",
            title: "Xem nhiều",
            subtitle: "",
            type: "ranking",
            items: rankingItems,
            more: { type: "list", name: "Danh sách", script: "search.js", input: "/xem-nhieu", data: "" }
        }
    ]);
}