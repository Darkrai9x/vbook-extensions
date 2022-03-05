function execute(url) {
    url = url.replace("m.keepshu.com", "www.keepshu.com");
    let response = fetch(url);

    if (response.ok) {
        let doc = response.html('gbk');
        var author = /作者：(.*?)$/.exec(doc.select(".booktitle p").text());
        if (author) author = author[1];
        doc.select(".lastchapter").remove();
        return Response.success({
            name: doc.select(".booktitle h1").first().text(),
            cover: doc.select(".bookcover-l img").first().attr("src"),
            author: author,
            description: doc.select(".book-intro").html(),
            detail: doc.select(".booktitle p").html(),
            host: "https://www.keepshu.com"
        });
    }
    return null;
}