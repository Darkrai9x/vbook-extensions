function execute(url, page) {

    if (!page) page = 1;

    let response = fetch(url + '/?page=' + page);

    if (response.ok) {
        let doc = response.html();

        let novelList = [];
        let next = doc.select(".pagination li.selected + li").last().text();
        if (!next) next = '';
        doc.select(".all-rank-list li").forEach(e => {
            novelList.push({
                name: e.select(".book-mid-info h4").text(),
                link: e.select(".book-mid-info a").first().attr("href"),
                cover: e.select(".book-img img").attr("src"),
                description: e.select(".author").text(),
                host: "https://www.dizishu.com"
            });
        });

        return Response.success(novelList, next);
    }
}