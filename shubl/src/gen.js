function execute(url, page) {
    if (!page) page = '1';

    let response = fetch(url + "/" + page);
    if (response.ok) {
        let doc = response.html();

        let novels = [];
        let page = doc.select(".page").select("li.selected + li").text();
        doc.select(".J_BookList li").forEach(e => {
            novels.push({
                name: e.select(".title").text(),
                link:  e.select("a").first().attr("href"),
                cover: e.select("img").first().attr("data-original"),
                description: e.select("m-t").text(),
            });
        });
        return Response.success(novels, page);
    }

    return null;
}