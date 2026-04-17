load('config.js');
function execute(url, page) {
    url = normalizeUrl(url);
    if (!page) page = '1';
    if (page !== '1') {
        url = url.replace(/\/page\/\d+\/?$/, "");
        url = url + "/page/" + page;
    }

    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        let list = parseCards(doc, ".halim_box article");
        let next = getNextPage(doc, page);
        return Response.success(list, next);
    }
    return null;
}
