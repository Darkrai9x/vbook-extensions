load("config.js");

function execute(url) {
    if (url.indexOf("sj.") === -1) {
        let bookId = url.match(/\/b\/(\d+)\/?$/)[1];
        url = MOBILE_URL + "/book.aspx?id=" + bookId;
    }
    let doc = fetch(url).html();

    if (doc) {

        var data = [];
        doc.select("#chapterList a").forEach(e => {
            data.push({
                name: e.select("a").text(),
                url: e.attr("href"),
                host: MOBILE_URL
            });
        });

        let page = doc.select(".pages a").last().attr("href").match(/page=(\d+)/);
        if (page) {
            page = parseInt(page[1]);
            if (page > 1) {
                for (let p = 2; p <= page; p++) {
                    doc = fetch(url + "&page=" + p).html();
                    doc.select("#chapterList a").forEach(e => {
                        data.push({
                            name: e.select("a").text(),
                            url: e.attr("href"),
                            host: MOBILE_URL
                        });
                    });
                }
            }
        }

        return Response.success(data);
    }

    return null;
}