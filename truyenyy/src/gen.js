function execute(url, page) {
    if (!page) page = '1';
    url = url.replace("truyenyy.com", "truyenyy.vip")
        .replace("truyenyy.vn", "truyenyy.vip");
    var doc = Http.get(url + "/?page=" + page).html();

    if (doc) {
        var el = doc.select(".books-list > li");
        var novelList = [];
        var next = doc.select(".pagination > li > a").last().attr("href").match(/page=(\d+)/);
        if (next) next = next[1]; else next = '';
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);

            var cover = e.select("img").first().attr("data-src");

            if (!cover) {
                cover = e.html().match(/(http.*?.jpg)/);
                if (cover) cover = cover[1]; else cover = '';
            }
            novelList.push({
                name: e.select(".book-title").text(),
                link: e.select("a").first().attr("href"),
                description: e.select(".book-author").text(),
                cover: cover,
                host: "https://truyenyy.vip",
            })
        }

        return Response.success(novelList, next);
    }

    return null;
}