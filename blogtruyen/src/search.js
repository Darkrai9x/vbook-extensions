function execute(key, page) {
    if (!page) page = '1';

    let response = fetch("https://blogtruyen.vn/timkiem/nangcao/1/0/-1/-1", {
        method: "GET",
        queries: {
            txt: key,
            p: page
        }
    });
    if (response.ok) {
        let doc = response.html();
        let novelList = [];
        let next = doc.select(".pagination > li.active + li").last().text();

        doc.select(".list .tiptip").forEach(e => {
            let id = e.attr("data-tiptip");

            let info = doc.select("#" + id);
            novelList.push({
                name: e.select("a").text(),
                link: e.select("a").attr("href"),
                cover: info.select("img").attr("src"),
                host: "https://blogtruyen.vn"
            });
        });

        return Response.success(novelList, next)
    }
    return null;
}
