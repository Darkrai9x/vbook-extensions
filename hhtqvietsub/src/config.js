const BASE_URL = "https://hhtqvietsub.cc";

function normalizeUrl(url) {
    url = url || BASE_URL;
    return url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
}

function parseCards(doc, selector) {
    let list = [];
    doc.select(selector).forEach(e => {
        let thumb = e.select("a.halim-thumb").first();
        let img = e.select("figure img").first();
        let description = e.select(".original_title").text();
        if (!description) {
            description = e.select(".episode").text();
        }

        list.push({
            name: e.select(".entry-title").text(),
            link: thumb.attr("href") || thumb.attr("data-href"),
            description: description,
            cover: img.attr("data-src") || img.attr("src"),
            tag: e.select(".episode").text(),
            host: BASE_URL,
        });
    });
    return list;
}

function getNextPage(doc, page) {
    let next = "";
    let nextPage = (parseInt(page, 10) || 1) + 1;
    doc.select(".page-numbers a.page-numbers").forEach(e => {
        let href = e.attr("href");
        let text = e.text();
        if (!next && (text === nextPage.toString() || href.indexOf("/page/" + nextPage) >= 0)) {
            next = nextPage.toString();
        }
    });
    return next;
}
