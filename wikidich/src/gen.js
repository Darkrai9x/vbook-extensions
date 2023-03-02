load('config.js');

function execute(url, page) {
    if (!page) page = '0';
    let response = fetch(BASE_URL + url, {
        method: "GET",
        queries: {
            start: page
        }
    });

    if (response.ok) {
        let doc = response.html();

        var next = doc.select(".pagination").select("li.active + li").select("a").attr("href").match(/start=(\d+)/);
        if (next) next = next[1];

        const data = [];
        doc.select(".book-list > .book-item").forEach(e => {
            data.push({
                name: e.select(".book-title").text(),
                link: e.select(".info-col > a").first().attr("href"),
                cover: e.select(".cover-col img").attr("src"),
                description: e.select(".book-author").text() + " - " + e.select(".book-publisher").last().text(),
                host: BASE_URL
            });
        });

        return Response.success(data, next);
    }

    return null;
}