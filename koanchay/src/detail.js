function execute(url) {
    const doc = Http.get(url).html()

    var name = doc.select(".cover-info h2").text();
    var author = doc.html().match(/tac-gia.*?>(.*?)</);
    if (author) author = author[1];

    var element = doc.select("div.cover-info").first();
    element.select("h2,span,i").remove();

    return Response.success({
        name: name,
        cover: doc.select("div.book-info img").first().attr("src"),
        author: author,
        description: doc.select("div.book-desc-detail").html(),
        detail: element.html(),
        host: "https://koanchay.com",
        ongoing: doc.select(".cover-info").html().indexOf("Còn tiếp") > 0,
        nsfw: true
    });
}