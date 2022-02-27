function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();

        let list = [];
        doc.select("#list-chap .list-item li a").forEach(e => list.push({
            name: e.text(),
            url: e.attr("href"),
            host: "https://www.truyenhayvn.com"
        }));
        return Response.success(list);

    }
    return null;
}