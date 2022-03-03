function execute(url) {
    url = url.replace("www.fansg.com", "m.fansg.com");
    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        doc.select(".book-intro .lastchapter").remove();
        return Response.success({
            name: doc.select(".book-info h2").first().text(),
            cover: doc.select(".book-info img").first().attr("src"),
            author: doc.select('.info a[href~=search]').text(),
            description: doc.select(".content").html(),
            detail: doc.select(".book-info p.info").html(),
            host: "http://m.fansg.com"
        });
    }
    return null;
}