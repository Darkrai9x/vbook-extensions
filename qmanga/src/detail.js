function execute(url) {
    load('config.js');
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        return Response.success({
            name: doc.select("h1.title-commic-detail").first().text(),
            cover: doc.select(".image-commic-detail img").first().attr("data-src"),
            author: doc.select(".area-writer a").first().text(),
            description: doc.select(".desc-commic-detail").html(),
            detail: doc.select(".area-writer").html() + doc.select(".area-drawer").html() + doc.select(".status_commic").html(),
            host: BASE_URL,
            ongoing: doc.select(".status_commic").html().indexOf("Đang tiến hành") >= 0
        });
    }
    return null;
}