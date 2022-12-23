function execute(key, page) {
    load('config.js');
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    if (!page) page = '1';

    var doc = Http.get(BASE_URL)
        .params({
            s: key,
            post_type: 'wp-manga',
            trang: page
        }).html();

    if (doc) {
        var el = doc.select(".list-truyen div[itemscope]");
        var novelList = [];
        var next = doc.select(".pagination > li.active + li").last().text();
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            novelList.push({
                name: e.select(".truyen-title > a").text(),
                link: e.select(".truyen-title > a").first().attr("href"),
                description: e.select(".author").text(),
                cover: e.select(".img-cover-wrap img").attr("src"),
                host: BASE_URL,
            });

        }
        return Response.success(novelList, next);
    }
    return null;
}
