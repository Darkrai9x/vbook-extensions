function execute(url) {
    url = url.replace("sstruyen.com", "sstruyen.vn");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html().select(".wrap-detail.pc");

        var detail = doc.select(".content1 div.info");
        var cover = doc.select("img").first().attr("data-pagespeed-high-res-src")
        if (!cover) cover = doc.select("img").first().attr("src")
        var status = doc.select(".content1 .status").html()
        doc.select(".content1 div.info").remove()

        return Response.success({
            name: doc.select("h1.title").first().text(),
            cover: cover,
            author: detail.select("a").first().text(),
            description: doc.select(".content1").html(),
            detail: detail.html(),
            host: "https://sstruyen.vn",
            ongoing: status.indexOf("Đang ra") >= 0
        });
    }

    return null;

}