function execute(url) {
    url = url.replace("wikidich.com", "wikidth.com");
    url = url.replace("wikidth.com", "wikidth.net");
    url = url.replace("wikidth.net", "wikidth.org");
    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();

        let name = doc.select(".cover-info h2").text();
        let author = doc.select(".cover-info").html().match(/tac-gia.*?>(.*?)</);
        if (author) author = author[1];

        let element = doc.select("div.cover-info").first();
        element.select("h2,span,i").remove();

        return Response.success({
            name: name,
            cover: doc.select("div.book-info img").first().attr("src"),
            author: author,
            description: doc.select("div.book-desc-detail").html(),
            detail: element.html(),
            host: "https://wikidth.org",
            ongoing: doc.select(".cover-info").html().indexOf("Còn tiếp") > 0
        });
    }
    return null;
}