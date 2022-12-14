function execute(url) {
    url = url.replace("saytruyen.net", "saytruyen.tv");
    url = url.replace("saytruyen.tv", "saytruyenvip.com");

    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        return Response.success({
            name: doc.select("h1").first().text(),
            cover: doc.select(".summary_image img").first().attr("src"),
            author: doc.select(".author-content").first().text(),
            description: doc.select(".description-summary").html(),
            detail: doc.select(".post-content .post-content_item").html(),
            host: "https://saytruyenvip.com",
            ongoing: doc.select(".post-content").text().indexOf("OnGoing") >= 0
        });
    }

    return null;
}