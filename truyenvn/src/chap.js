load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        var imgs = [];
        doc.select(".reading-content img[id^=image]").forEach(e => imgs.push(e.attr("data-src").trim()));
        return Response.success(imgs);
    }
    return null;
}