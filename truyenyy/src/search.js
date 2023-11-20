load('config.js');
function execute(key, page) {
    if (!page) page = '1';
    let response = fetch(BASE_URL + "/tim-kiem/nang-cao/", {
        method: "GET",
        queries: {
            q: key, page: page
        }
    });

    if (response.ok) {
        let doc = response.html();
        let isMobile = doc.select("meta[name=mobile-web-app-capable]").attr("content") === "yes";

        var novelList = [];
        var next = "";
        if (isMobile) {
            next = doc.select(".pagination > li > a").last().attr("href").match(/page=(\d+)/);
            if (next) next = next[1]; else next = '';
            doc.select(".content .weui-cells a").forEach(e => {
                novelList.push({
                    name: e.select("p").first().text(),
                    link: e.attr("href"),
                    description: e.select(".weui-cell__ft").text(),
                    host: BASE_URL,
                })
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
                })
            });
        }

        return Response.success(novelList, next);
    }

    return null;
}
