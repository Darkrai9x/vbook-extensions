load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let data = [];
        doc.select(".page-chapter img").forEach(e => {
            let img = e.attr("data-original");
            if (!img) {
                img = e.attr("src");
            }
            if (img) {
                if (img.startsWith("//")) {
                    img = "http:" + img;
                }
                data.push(img);
            }
        });
        return Response.success(data);
    }
    return null;
}