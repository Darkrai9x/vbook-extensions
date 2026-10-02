// similar.js — referenced from detail.js `suggests`. `input` here is a raw
// HTML fragment (already scraped alongside the detail page), not a URL —
// parse it directly instead of fetching.
function execute(input) {
    let doc = Html.parse(input);

    let items = doc.select("SELECTOR_SIMILAR_ITEMS").map(function (el) {
        return {
            name: el.select("SELECTOR_ITEM_NAME").text(),
            cover: el.select("SELECTOR_ITEM_COVER img").attr("src"),
            link: el.select("SELECTOR_ITEM_LINK a").attr("href"),
            description: el.select("SELECTOR_ITEM_DESC").text()
        };
    });

    return Response.success(items, "");
}
