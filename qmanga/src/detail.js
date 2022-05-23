function execute(url) {
    url = url.replace("qmanga.net", "qmanga.co");
    url = url.replace("qmanga.co", "qmanga2.net");
    url = url.replace("qmanga2.net", "qmanga3.com");
    const doc = Http.get(url).html()
    return Response.success({
        name: doc.select("h1.title-commic-detail").first().text(),
        cover: doc.select(".image-commic-detail img").first().attr("data-src"),
        author: doc.select(".area-writer a").first().text(),
        description: doc.select(".desc-commic-detail").html(),
        detail: doc.select(".area-writer").html() + doc.select(".area-drawer").html() + doc.select(".status_commic").html(),
        host: "https://qmanga3.com",
        ongoing: doc.select(".status_commic").html().indexOf("Đang tiến hành") >= 0
    });
}