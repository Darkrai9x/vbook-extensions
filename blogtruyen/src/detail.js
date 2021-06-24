function execute(url) {
    var doc = Http.get(url).html();
    if (doc) {
        doc.select(".fb-page").remove();
        var author = doc.select(".description").last().html().match(/<a .*?\/tac-gia\/.*?>(.*?)<\/a>/);
        if (author) author = author[1]; else author = '';
        return Response.success({
            name: doc.select("title").text().replace(/\s*\|\s*BlogTruyen.Com/, ""),
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