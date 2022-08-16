function execute(url, page) {
    if (!page) page = '1';
    let response = fetch(url + "/trang-" + page);
    if (response.ok) {
        let doc = response.html();

        var next = doc.select(".pagination").select(".next").select("a").attr("href").match(/trang-(\d+)/)
        if (next) next = next[1]

        const data = [];
        doc.select(".table-list.pc tr").forEach(e => {
            data.push({
                name: e.select(".info a").first().text(),
                link: e.select(".info a").first().attr("href"),
                cover: e.select("img").first().attr("src"),
                description: e.select(".chap").text(),
                host: "https://sstruyen.vn"
            });
        });

        return Response.success(data, next);
    }
    return null;
}