function execute(id, page) {
    if (!page) page = '1';

    let response = fetch("https://blogtruyen.vn/ajax/Category/AjaxLoadMangaByCategory", {
        method: "GET",
        queries: {
            id: id,
            orderBy: "5",
            p: page
        }
    });
    if (response.ok) {
        let doc = response.html();
        let novelList = [];

        let next = doc.select(".paging > .current_page + .page").last().text();

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

        return Response.success(novelList, next);
    }

    return null;
}