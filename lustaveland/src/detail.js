function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();

        let info = doc.select(".book__detail-container");
        info.select(".book__detail-name > div").remove();
        return Response.success({
            name: info.select(".book__detail-name").text(),
            cover: info.select("img").first().attr("src"),
            author: info.select(".book__detail-text a").first().text(),
            description: doc.select("#home").html(),
            detail: info.select(".book__detail-text").html(),
            ongoing: info.html().indexOf("Truyện Full") === -1,
            host: "https://lustaveland.com",
            type: doc.select(".breadcrumb__container").html().indexOf("truyen-tranh") > 0 ? "comic" : "novel"
        });
    }
    return null;
}