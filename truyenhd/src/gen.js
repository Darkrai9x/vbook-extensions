load('config.js');
function execute(url, page) {
    var doc;
    if (!page) {
        page = '1';
        doc = fetch(url).html().select(".theloai-thumlist");
    } else {
        let slug = url.match(/keyword\/(.*?)$/);
        doc = Html.parse("<table>" + fetch(BASE_URL + "/wp-admin/admin-ajax.php", {
            method: 'POST',
            body: {
                'action': "load_more_tax",
                'keyword_check': "",
                'current_page_tax': page,
                'max_page_tax': "23",
                'option_keyword_tax': "new-chap",
                'term[taxonomy]': "keyword",
                'term[slug]': slug[1]
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