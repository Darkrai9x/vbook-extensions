function execute(url, page) {
    load('config.js');
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    if (!page) page = '1';
    let response = fetch(BASE_URL + url + "/" + page);

    if (response.ok) {

        let doc = response.html();

        let next = doc.select(".cm-pagination").select("a.active + a").text();

        const data = [];
        doc.select(".category-items > ul > li").forEach(e => {
            data.push({
                name: e.select(".category-name a").first().text(),
                link: e.select(".category-name a").first().attr("href"),
                cover: e.select(".category-img img").first().attr("src"),
                description: e.select(".category-feature-content-text span").text(),
                host: BASE_URL
            })
        });

        return Response.success(data, next)
    }
    return null;
}