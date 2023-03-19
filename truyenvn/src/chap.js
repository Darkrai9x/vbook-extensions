load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        doc.select("img[src*='CREDIT-TRUYENVN-FROM-SEPT.jpg']").remove();
        let imgs = [];
        doc.select(".content-text img[loading*='lazy']").forEach(e => {
            let url = e.attr("src");
            if (!url.endsWith('truyenvn-tv-banner.jpg')
                && !url.endsWith('credit-truyenvn-tv.jpg')) {
                imgs.push(url);
            }
        });
        return Response.success(imgs);
    }

    return null;
}