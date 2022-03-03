function execute(url) {
    url = url.replace("www.fansg.com", "m.fansg.com");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let chapList = [];
        doc.select(".bookshelf-list a").forEach(e => {
            chapList.push({
                name: e.text(),
                url: e.attr("href"),
                host: "http://m.fansg.com"
            });
        });
        return Response.success(chapList);
    }
    return null;
}