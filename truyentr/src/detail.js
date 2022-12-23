function execute(url) {
    load('config.js');
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    var doc = Http.get(url).html();
    if (doc) {
        return Response.success({
            name: doc.select("h1.title").text(),
            cover: doc.select(".col-12.col-md-4.text-center img").attr("data-src"),
            host: BASE_URL,
            author: doc.select(".content1 > div > p:nth-child(1)").text(),
            description: doc.select("#more").html(),
            detail: doc.select(".content1 > div > p:nth-child(2)").html(),
        });
    }
    return null;
}