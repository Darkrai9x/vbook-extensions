function execute(url) {
    const doc = Http.get(url).html();

    var author = doc.select(".storyInfo .column-half .meta").first();
    author.select("label").remove();
    return Response.success({
        name: doc.select(".storyTitle").first().text(),
        cover: doc.select(".coverThumbnail img").first().attr("src"),
        author: author.text(),
        description: doc.select(".storyContent").html(),
        detail: doc.select(".storyInfo .column-half").html(),
        host: "https://santruyen.com",
        ongoing: doc.select(".storyInfo .column-half").html().indexOf("Đang cập nhật") >= 0
    });
}