function execute(url, page) {
    var doc;
    if (!page) {
        page = '1';
        doc = Http.get(url).html().select(".theloai-thumlist");
    } else {
        var slug = url.match(/keyword\/(.*?)$/);
        doc = Http.post("https://truyenhd1.com/wp-admin/admin-ajax.php")
            .params({
                'action': "load_more_tax",
                'keyword_check': "",
                'current_page_tax': page,
                'max_page_tax': "23",
                'option_keyword_tax': "new-chap",
                'term[taxonomy]': "keyword",
                'term[slug]': slug[1]
            }).html();
    }

    if (doc) {
        var el = doc.select("li");
        var novelList = [];
        var next = parseInt(page) + 1;
        for (var i = 0; i< el.size(); i++) {
            var e = el.get(i);
            var cover = e.select(".thumbnail img").attr("data-src");
            if (!cover)
                cover = e.select(".thumbnail img").attr("src");
            novelList.push({
                name: e.select("h2").last().text(),
                link: e.select(" a").attr("href"),
                cover: cover,
                description: e.select(".content p").first().text(),
                host: "https://truyenhd1.com"
            });
        }

        return Response.success(novelList, next);
    }
    return null;
}