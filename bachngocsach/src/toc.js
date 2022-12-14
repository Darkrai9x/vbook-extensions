function execute(url) {
    url = url.replace("bachngocsach.com", "truyenbns.com");

    let response = fetch(url + "/muc-luc?page=all");
    if (response.ok) {
        let doc = response.html();

        let list = [];
        doc.select("#mucluc-list .chuong-item a").forEach(e => list.push({
            name: e.select(".chuong-name").text(),
            url: e.attr("href"),
            host: "https://truyenbns.com"
        }));
        return Response.success(list);

    }
    return null;
}