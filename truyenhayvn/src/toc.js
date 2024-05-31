load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();

        let list = [];
        doc.select("#list-chap .list-item li a").forEach(e => list.push({
            name: e.text(),
            url: e.attr("href"),
            host: BASE_URL
        }));
        return Response.success(list);

    }
    return null;
}