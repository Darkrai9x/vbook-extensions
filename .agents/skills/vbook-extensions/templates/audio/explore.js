load('config.js');
// explore.js — sectioned discover page: a banner carousel + one or more rows.
// Per section, pick static or dynamic to match the site: data already in this
// response → `items`; data needing its own page/API → `script`/`input`.
// Banner/latest below are static, ranking is dynamic; switch either way as needed.
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
            subtitle: "Album vừa phát hành",
            type: "grid",
            items: latestItems,
            more: { type: "list", name: "Danh sách", script: "search.js", input: "/moi-cap-nhat" }
        },
        {
            id: "ranking",
            title: "Xem nhiều",
            subtitle: "",
            type: "ranking",
            // Dynamic: the app calls search.js as execute(input, "") after the page shows.
            // If this data is on the homepage, parse it above and use `items` instead.
            script: "search.js",
            input: "/xem-nhieu",
            more: { type: "list", name: "Danh sách", script: "search.js", input: "/xem-nhieu" }
        }
    ]);
}
