function execute(url) {
    url = url.replace("lightnovelreader.org", "lightnovelreader.me");
    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();

        let chapList = [];
        let el = doc.select(".novels-detail-chapters li a");
        for (let i = el.length - 1; i >= 0; i--) {
            let e = el.get(i);
            chapList.push({
                name: e.text(),
                url: e.attr("href"),
                host: "https://lightnovelreader.me"
            });
        }
        return Response.success(chapList);
    }

    return null;
}