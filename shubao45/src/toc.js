function execute(url) {
    let response = fetch(url + "/");
    if (response.ok) {
        let doc = response.html('gbk');
        let chapList = [];
        doc.select(".chapter").last().select("a").forEach(e => {
            chapList.push({
                name: e.text(),
                url: e.attr("href"),
                host: "http://m.shubao45.com"
            });
        });
        return Response.success(chapList);
    }
    return null;
}