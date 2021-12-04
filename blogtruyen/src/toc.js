function execute(url) {
    url = url.replace("m.blogtruyen.vn", "blogtruyen.vn");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let list = [];
        let name = doc.select("title").text().replace(/\s*\|\s*BlogTruyen.Com/, "");
        let el = doc.select("#list-chapters .title a");
        for (let i = el.length - 1; i >= 0; i--) {
            let e = el.get(i);
            list.push({
                name: e.text().replace(new RegExp("^" + name + " "), ""),
                url: e.attr("href"),
                host: "https://blogtruyen.vn"
            });
        }
        return Response.success(list)
    }
    return null;
}