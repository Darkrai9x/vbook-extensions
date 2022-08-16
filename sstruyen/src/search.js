function execute(key, page) {
    if (!page) page = '1';
    let response = fetch("https://sstruyen.vn/tim-truyen/" + key + "/trang-" + page);
    if (response.ok) {
        let doc = response.html();

        var next = doc.select(".pagination").select(".next").select("a").attr("href").match(/trang-(\d+)/)
        if (next) next = next[1]

        const data = [];

        doc.select(".grid-items .inner-item").forEach(e => {
            data.push({
                name: e.select(".name-book").text(),
                link: e.select("a").first().attr("href"),
                cover: e.select("img").first().attr("src"),
                description: e.select(".rate").text(),
                host: "https://sstruyen.vn"
            });
        });

        return Response.success(data, next);
    }

    return null;

}