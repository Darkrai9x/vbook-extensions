function execute(url) {
    const doc = Http.get(url).html()

    return Response.success({
        name: doc.select("h3 a").text(),
        cover: doc.select(".img-container img").first().attr("src"),
        author: doc.select("ul.list > li:nth-child(9)").first().text(),
        description: doc.select(".block-content > .text-danger").text(),
        detail: doc.select("ul.list > li:nth-child(5)").html()+ "<br>" + doc.select("ul.list > li:nth-child(11)").html(),
        category: doc.select("ul.list > li:nth-child(11)").html(),
        host: "https://hentai2read.com",
        nsfw: true
    });
}