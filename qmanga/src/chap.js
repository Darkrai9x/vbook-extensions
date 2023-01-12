function execute(url) {
    load('config.js');
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();

        let data = [];
        doc.select("#aniimated-thumbnial img").forEach(e => {
            let img = e.attr("src");
            if (img) {
                if (img.startsWith("//")) {
                    img = "https:" + img;
                }
                data.push(img);
            }
        })
        return Response.success(data);
    }
    return null;
}