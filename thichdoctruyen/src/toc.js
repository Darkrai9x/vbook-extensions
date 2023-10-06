function execute(url) {
    url = url.replace("thichdoctruyen.com", "thichdoctruyen.vip")
    let response = fetch(url);
    if (response.ok) {
        const doc = response.html();
        const list = [];
        let el = doc.select("#dschuong a");
        for (let i = 0; i < el.size(); i++) {
            let e = el.get(i);
            list.push({
                name: e.text(),
                url: e.attr("href"),
                host: "http://thichdoctruyen.vip"
            });
        }
        return Response.success(list);
    }
    return null;
}
