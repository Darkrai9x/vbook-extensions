function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let page = doc.select("table.ptt").first().select("td");
        if (page.length > 2) page = parseInt(page.get(page.length - 2).select("a").text());
        else page = 1;

        let data = [];
        for (let i = 0; i < page; i++) {
            data.push({
                name: "Page " + i,
                url: url + "/?p=" + i
            });
        }
        return Response.success(data);
    }

    return null;
}