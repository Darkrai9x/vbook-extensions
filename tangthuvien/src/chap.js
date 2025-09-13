load("config.js");
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url, {
        headers: {"user-agent": UserAgent.chrome()},
    });
    if (response.ok) {
        let doc = Html.parse(response.text().replace(new RegExp('\r?\n','g'), "<br />"));
        if (doc) {
            return Response.success(doc.select("div.box-chap").first().html());
        }
    }
    return null;
}