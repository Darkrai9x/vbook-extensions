// Detail `suggests` source: `input` is an HTML fragment from detail.js, not a URL.
function execute(input) {
    let doc = Html.parse(input);
    return Response.success(doc.select("SELECTOR_SIMILAR_ITEMS").map(function (el) {
        return {
            name: el.select("SELECTOR_ITEM_NAME").text(),
            cover: el.select("SELECTOR_ITEM_COVER img").attr("src"),
            link: el.select("SELECTOR_ITEM_LINK a").attr("href"),
            description: el.select("SELECTOR_ITEM_LAST_CHAP").text()
        };
    }), "");
}
