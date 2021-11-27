function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        return Response.success({
            "name": doc.select("h1").text(),
            "cover": doc.select(".cover img").first().attr("src"),
            "host": "https://chivi.app",
            "author": doc.select("[property=og:novel:author]").attr("content"),
            "description": doc.select(".section-content").html(),
            "detail": doc.select(".extra").first().html(),
            "ongoing": doc.select(".extra").first().html().indexOf("Còn tiếp") >= 0
        });
    }
    return null
}