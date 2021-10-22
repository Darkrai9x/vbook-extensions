function execute(url) {
    const doc = Http.get(url).html();
    return Response.success({
        name: doc.select("h1.tblue").first().text(),
        cover: doc.select(".row .col-sm-4  img").attr("src"),
        author: doc.select(".row .mg-t-10").text(),
        description: doc.select(".content_p").text(),
        host: "https://nhasachmienphi.com"
    });
}

