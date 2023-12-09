load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url + "/zjml/1");
    if (response.ok) {
        let doc = response.html();
        let pages = [];

        doc.select("#indexselect option").forEach(e => {
            pages.push(BASE_URL + e.attr("value"));
        });
        if (pages.length === 0) {
            pages.push(url + "/zjml/1");
        }

        return Response.success(pages);
    }

    return null;
}