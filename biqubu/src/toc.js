function execute(url) {
    let response = fetch(url + "/");
    if (response.ok) {
        let doc = response.html();
        const data = [];
        doc.select("#list a").forEach(e => data.push({
            name: e.select("a").text(),
            url: e.attr("href"),
            host: "https://www.biqubu.com"
        }));

        return Response.success(data);
    }
    return null;
}