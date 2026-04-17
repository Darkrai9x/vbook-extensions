load('config.js');
function execute(key, page) {
    if (!page) page = '1';
    let response = fetch(BASE_URL + "/", {
        queries: {
            s: key
        }
    });
    if (response.ok) {
        let doc = response.html();
        let list = parseCards(doc, ".halim_box article");
        return Response.success(list, "");
    }
    return null;
}
