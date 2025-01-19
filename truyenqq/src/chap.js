load('bypass.js');
load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let doc = bypass(url, fetch(url).html());
    if (doc) {
        let imgs = doc.select(".chapter_content img.lazy");
        let data = [];
        for (let i = 0; i < imgs.size(); i++) {
            let e = imgs.get(i);
            let dataOriginal = e.attr("data-original")
            let dataCdn = e.attr("data-cdn");
            data.push({
                link: e.attr("src"),
                fallback: [dataOriginal, dataCdn]
            });
        }
        return Response.success(data);
    }
    return null;
}
