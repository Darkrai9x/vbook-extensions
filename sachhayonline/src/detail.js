function execute(url) {
    const doc = Http.get(url).html();
    return Response.success({
        name: doc.select(".inner a h3").first().text(),
        cover: doc.select(".row .image img").attr("src"),
        author: null,
        description: doc.select(".inner p").first().text(),
        host: "https://sachhayonline.com"
    });
}
