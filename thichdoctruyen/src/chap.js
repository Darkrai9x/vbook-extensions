load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let htm = doc.select("div.boxview").html();
        if (htm.length < 2000 && htm.indexOf("login/login") > 0) return null;
        return Response.success(htm.replace("&nbsp;", ""));
    }
    return null;
}