function execute(url) {
    var bookId = /_(\d+).html/.exec(url);
    if (bookId) bookId = bookId[1];
    let response = fetch("https://www.keepshu.com/chapterlist_" + bookId + ".html");
    if (response.ok) {
        let doc = response.html('gbk');
        let chapList = [];
        doc.select(".chapter-list a").forEach(e => {
            chapList.push({
                name: e.text(),
                url: e.attr("href"),
                host: "https://www.keepshu.com"
            })
        });
        return Response.success(chapList);
    }
    return null;
}