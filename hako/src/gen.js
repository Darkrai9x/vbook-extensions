function execute(url, page) {
    if (!page) page = '1';
    let response = fetch(url, {
        method: "GET",
        queries: {
            page: page
        }
    });

    if (response.ok) {
        let doc = response.html();
        let next = doc.select(".pagination-footer a.current + a").text()

        let novelList = doc.select(".thumb-section-flow .thumb-item-flow").map(e => ({
            name: e.select(".series-title a").text(),
            link: e.select(".series-title a").attr("href"),
            description: e.select(".chapter-title").text(),
            cover: e.select(".img-in-ratio").attr("data-bg"),
            host: "https://ln.hako.re"
        }));

        return Response.success(novelList, next);
    }

    return null;
}