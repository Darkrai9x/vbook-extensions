function execute(url) {
    url = url.replace("m.mibiquge.com", "www.mibiquge.com");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        const data = [];
        doc.select("#list dl").last().select("a").forEach(e => data.push({
            name: e.select("a").text(),
            url: e.attr("href"),
            host: "https://www.mibiquge.com"
        }));

        return Response.success(data);
    }
    return null;
}