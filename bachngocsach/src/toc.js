function execute(url) {
    let response = fetch(url + "/muc-luc?page=all");
    if (response.ok) {
        let doc = response.html();

        let list = doc.select("#mucluc-list .chuong-item a").map(e => ({
            name: e.select(".chuong-name").text(),
            url: e.attr("href"),
            host: "https://bachngocsach.com"
        }));
        return Response.success(list);

    }
    return null;
}