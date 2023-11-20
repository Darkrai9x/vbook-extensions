load('config.js');
function execute(url, page) {
    if (!page) page = '1';

    let response = fetch(url + "/?page=" + page);
    if (response.ok) {
        let doc = response.html();
        let isMobile = doc.select(".books-list").length === 0;
        let novelList = [];
        var next = "";
        if (isMobile) {
            next = doc.select(".pagination").select("li.active + li").text();
            doc.select(".weui-cells > a.weui-cell").forEach(e => {
                novelList.push({
                    name: e.select("h3").text(),
                    link: e.attr("href"),
                    description: e.select("h4").text(),
                    host: BASE_URL,
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
                    host: BASE_URL,
                });
            });
        }

        return Response.success(novelList, next);
    }
    return null;
}