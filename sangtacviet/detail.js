function execute(url) {
    const doc = Http.get(url).html();

    var author = doc.html().match(/Tác giả:.*?\s+(.*?)\s*</);
    if (author) author = author[1];
    return Response.success({
        name: doc.select("#book_name2").first().text(),
        cover: doc.select(".container:has(#book_name2) img").first().attr("src"),
        author: author,
        description: doc.select(".blk:has(.fa-water) .blk-body").html(),
        detail: doc.select(".blk:has(.fa-info-circle) .blk-body").html(),
        host: "http://sangtacviet.com"
    });
}