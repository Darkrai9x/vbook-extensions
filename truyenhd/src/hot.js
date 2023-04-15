load('config.js');
function execute(url, page) {
    var doc;
    var urls = url.split(' ');
    if (!page) {
        page = '1';
        doc = fetch(urls[0]).html().select(".theloai-thumlist");
    } else {
        doc = Html.parse("<table>" + fetch(BASE_URL + "/wp-admin/admin-ajax.php", {
            method: 'POST',
            body: {
                'action': "load_more_page_keyword",
                'current_page_tax': page,
                'the_loai': urls[1],
                'option_keyword_tax': urls[2]
            }
        }).text() + "</table>");
    }

    if (doc) {
        let novelList = [];
        let next = parseInt(page) + 1;
        doc.select("tr").forEach(e => {
            var cover = e.select(".thumbnail img").attr("data-src");
            if (!cover)
                cover = e.select("img").attr("src");
            novelList.push({
                name: e.select("h2").last().text(),
                link: e.select(" a").attr("href"),
                cover: cover,
                description: e.select(".content p").first().text(),
                host: BASE_URL
            });
        });
        return Response.success(novelList, next);
    }
    return null;
}