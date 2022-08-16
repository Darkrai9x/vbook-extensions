function execute(url) {
    url = url.replace("sstruyen.com", "sstruyen.vn");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();

        let title = doc.select("div.list-chap .col-xs-12")
        if (title.size() === 2) {
            doc.select("div.list-chap .col-sm-6").first().remove();
        }
        const data = [];
        doc.select("div.list-chap ul li a").forEach(e => {
            data.push({
                name: e.text(),
                url: e.attr("href"),
                host: "http://sstruyen.vn"
            });
        });

        return Response.success(data);
    }

    return null;
}