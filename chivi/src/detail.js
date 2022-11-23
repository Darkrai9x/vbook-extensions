function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let coverImg =  doc.select(".cover source").first().attr("srcset")
        if (coverImg.startsWith("/")) {
            // coverImg = "https://chivi.app" + coverImg;
            coverImg = "https:" + coverImg;
        }
        let author = doc.select("[property=og:novel:author]").attr("content");
        return Response.success({
            "name": doc.select("h1").text(),
            "cover": coverImg,
            "host": "https://chivi.app",
            "author": author,
            "description": doc.select(".section-content .intro").html().replace("<!-- HTML_TAG_START -->",""),
            "detail": "Tác giả: " + author +"<br>" + "Thể loại: " + doc.select(".main-info .line .bgenres").first().text(),
            "ongoing": doc.select(".stat._status").first().html().indexOf("Còn tiếp") >= 0
        });
    }
    return null
}