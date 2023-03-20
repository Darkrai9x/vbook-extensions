function execute(url) {
    url = url.replace("m.shubl.com", "shubl.com");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let chapList = [];
        let parts = doc.select("#chapter_list > .chapter")
        parts.forEach(part => {
            var partName = '';
            if (parts.length > 1) {
                partName = part.text()
            }
            part.select(".articles .chapter_item").forEach(e => {
                chapList.push({
                    name: partName + e.text(),
                    url: e.select("a").attr("href"),
                    pay: e.select(".lock").length > 0,
                    host: "https://shubl.com"
                });
                partName = '';
            });
        });
        return Response.success(chapList);
    }
    return null;
}