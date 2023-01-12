function execute(url) {
    load('config.js');
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();

        return Response.success({
            name: doc.select(".section-header-title h2").first().text(),
            cover: doc.select(".novels-detail img").first().attr("src"),
            author: doc.select(".novels-detail a[href~=author]").first().text(),
            description: doc.select(".empty-box").last().html(),
            detail: doc.select(".novels-detail-right").html(),
            ongoing: doc.select(".novels-detail-right li").html().indexOf("Ongoing") >= -1,
            host: BASE_URL
        });
    }
    return null;
}