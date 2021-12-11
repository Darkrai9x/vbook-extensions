function execute(url) {
    url = url.replace("wikidich.com", "wikidth.com");
    url = url.replace("wikidth.com", "wikidth.net");
    const doc = Http.get(url).html()

    var name = doc.select(".cover-info h2").text();
    var author = doc.select(".cover-info").html().match(/tac-gia.*?>(.*?)</);
    if (author) author = author[1];

    var element = doc.select("div.cover-info").first();
    element.select("h2,span,i").remove();

    return Response.success({
        name: name,
        cover: doc.select("div.book-info img").first().attr("src"),
        author: author,
        description: doc.select("div.book-desc-detail").html(),
        detail: element.html(),
        host: "https://wikidth.net",
        ongoing: doc.select(".cover-info").html().indexOf("Còn tiếp") > 0
    });
}