function execute(url, page) {

    if (!page) page = 1;

    let response = fetch(url + '/?page=' + page);

    if (response.ok) {
        let doc = response.html();

        let novelList = [];
        let next = doc.select(".pagination li.selected + li").last().select("a").text();
        if (next) next = next[1]; else next = '';
        doc.select(".all-book-list li").forEach(e => {
            novelList.push({
                name: e.select(".book-info h4").text(),
                link: e.select(".book-info a").first().attr("href"),
                cover: e.select(".book-img img").attr("src"),
                description: e.select(".book-info .author").text() + e.select(".book-info .tag").text(),
                host: "https://www.dizishu.com"
            });
        });

        return Response.success(novelList, next);
    }
}