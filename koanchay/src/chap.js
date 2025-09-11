load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url, {
        headers: {"user-agent": UserAgent.system()},
    });
    if (response.ok) {
        let doc = response.html();
        return Response.success(doc.select("div#bookContentBody").html());
    }

    return null;
}