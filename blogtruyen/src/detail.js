function execute(url) {
    url = url.replace("m.blogtruyen.vn", "blogtruyen.vn");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        doc.select(".fb-page").remove();
        let author = doc.select(".description").last().html().match(/<a .*?\/tac-gia\/.*?>(.*?)<\/a>/);
        if (author) author = author[1]; else author = '';
        return Response.success({
            name: doc.select("title").text().replace(/\s*\|\s*BlogTruyen.VN/, ""),
            cover: doc.select(".thumbnail img").first().attr("src"),
            host: "https://blogtruyen.vn",
            author: author,
            description: doc.select(".detail > .content").html(),
            detail: doc.select(".description").last().html(),
            ongoing: doc.select(".description").last().html().indexOf("Đang tiến hành") >= 0
        });
    }
    return null;
}