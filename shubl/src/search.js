function execute(key, page) {
    if (!page) page = '1';

    let response = fetch("https://www.shubl.com/index/get_search_book_list/" + key + "/" + page);
    if (response.ok) {
        let doc = response.html();

        let novels = [];
        let page = doc.select(".page").select("li.selected + li").text();
        doc.select(".book-list li").forEach(e => {
            novels.push({
                name: e.select(".book-name").text(),
                link:  e.select("a").first().attr("href"),
                cover: e.select("img").first().attr("data-original"),
                description: e.select(".book-info .smaller").first().text(),
            });
        });
        return Response.success(novels, page);
    }

    return null;
}