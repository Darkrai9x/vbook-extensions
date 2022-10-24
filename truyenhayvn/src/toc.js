function execute(url) {
    url = url.replace(/(www.)?truyenhayvn.com/g, "1.truyenhayvn.com");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();

        let list = [];
        doc.select("#list-chap .list-item li a").forEach(e => list.push({
            name: e.text(),
            url: e.attr("href"),
            host: "https://1.truyenhayvn.com"
        }));
        return Response.success(list);

    }
    return null;
}