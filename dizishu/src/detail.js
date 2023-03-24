function execute(url) {
    url = url.replace('m.dizishu.com', "www.dizishu.com");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        return Response.success({
            name: doc.select(".book-text h1").text(),
            cover: doc.select(".book-img img").first().attr("src"),
            host: "https://www.dizishu.com",
            author: doc.select(".book-text span").first().text(),
            description: doc.select(".intro").html(),
            detail: doc.select(".book-text span").first().text() + "<br>" +doc.select(".tag span").first().html(),
            ongoing: doc.select(".tag span").last().text().indexOf("连载中") >= 0
        });
    }
    return null;
}
