load("config.js");
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        const data = [];
        doc.select("#list a").forEach(e => data.push({
            name: e.text(),
            url: e.attr("href"),
            host: BASE_URL
        }));

        return Response.success(data);
    }
    return null;
}