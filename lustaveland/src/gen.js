load('config.js');

function execute(url, page) {
    if (!page) page = '1';
    let response = fetch(url + "?page=" + page);

    if (response.ok) {

        let doc = response.html();

        let next = doc.select(".pagination").select(".active + li").select("a").text();

        const data = [];
        doc.select(".home__lg-book .book-vertical__item").forEach(e => {
            data.push({
                name: e.select(".book__lg-title a").first().text(),
                link: e.select(".book__lg-title a").first().attr("href"),
                cover: e.select(".book__lg-image img").first().attr("data-src"),
                description: e.select(".book__lg-category ").text(),
                host: BASE_URL
            })
        });

        return Response.success(data, next)
    }
    return null;
}