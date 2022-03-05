function execute(url, page) {
    if (!page) page = '1';
    url = url.replace("truyenyy.com", "truyenyy.vip")
        .replace("truyenyy.vn", "truyenyy.vip");

    let response = fetch(url + "/?page=" + page);
    if (response.ok) {
        let doc = response.html();
        let isMobile = doc.select(".books-list").length === 0;
        let novelList = [];
        var next = "";
        if (isMobile) {
            next = doc.select(".pagination").select("li.active + li").text();
            doc.select(".weui-panel__bd > a").forEach(e => {
                let cover = e.select("img.weui-media-box__thumb").first().attr("data-src");
                if (!cover) cover = e.select("img.weui-media-box__thumb").first().attr("src");
                novelList.push({
                    name: e.select("h3").text(),
                    link: e.attr("href"),
                    cover: cover,
                    description: e.select(".weui-media-box__bd .small").first().text(),
                    host: "https://truyenyy.vip",
                });
            });
        } else {
            next = doc.select(".pagination > li > a").last().attr("href").match(/page=(\d+)/);
            if (next) next = next[1]; else next = '';
            doc.select(".books-list > li").forEach(e => {
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
                });
            });
        }

        return Response.success(novelList, next);
    }
    return null;
}