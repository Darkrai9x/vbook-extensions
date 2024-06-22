load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let imgs = [];
        doc.select("noscript").remove();
        doc.select(".reading-content img[id^=image]").forEach(e => {
            let url = e.attr("data-src").trim();
            if (!url) {
                url = e.attr("data-lazy-src").trim();
            }
            if (!url) {
                url = e.attr("src").trim();
            }
            imgs.push(url);
        });
        return Response.success(imgs);
    }
    return null;
}