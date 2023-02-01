function execute(url) {
    load('config.js');
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let data = [];
        doc.select("#chapter_content img").forEach(e => {
            let img = e.attr("src").trim();
            if (img) {
                if (img.startsWith("//")) {
                    img = "https:" + img;
                }
                if (img.startsWith("/")) {
                    img = BASE_URL + img;
                }

                if (!img.startsWith("http")) {
                    img = BASE_URL + "/" + img;
                }
                data.push(img);
            }
        });
        return Response.success(data);
    }

    return null;
}