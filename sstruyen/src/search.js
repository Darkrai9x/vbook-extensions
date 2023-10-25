function execute(key, page) {
    if (!page) page = '1';
    let response = fetch("https://sstruyen.vn/tim-truyen/" + key + "/trang-" + page);
    if (response.ok) {
        let doc = response.html();

        const data = [];

        doc.select(".table-list tr").forEach(e => {
            data.push({
                name: e.select(".info h3 a").text(),
                link: e.select("a").first().attr("href"),
                cover: e.select("img").first().attr("src"),
                description: e.select(".rate").text(),
                host: "https://sstruyen.vn"
            });
        });

        return Response.success(data);
    }

    return null;

}