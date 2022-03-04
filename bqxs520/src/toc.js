function execute(url) {
    let bookId = /\/(\d+)$/.exec(url)[1];
    let response = fetch("http://m.bqxs520.com/list/" + bookId + ".html");
    if (response.ok) {
        let doc = response.html();
        const data = [];
        doc.select("#chapterlist a[href~=html]").forEach(e => data.push({
            name: e.select("a").text(),
            url: e.attr("href"),
            host: "https://www.bqxs520.com"
        }));

        return Response.success(data);
    }
    return null;
}