function execute(url) {
    url = url.replace("m.shubl.com", "shubl.com");
    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        return Response.success({
            name: doc.select(".book-title span").first().text(),
            cover: doc.select("img.book-img").first().attr("data-original"),
            author: doc.select(".user-info .username").first().text(),
            description: doc.select(".book-brief").html(),
            detail: doc.select(".user-info .username").first().text() + "<br>" + doc.select(".book-info-numbers"),
            ongoing: doc.select(".book-title").html().indexOf("连载") >= 0,
            host: "https://shubl.com"
        });
    }
    return null;
}