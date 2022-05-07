function execute(key, page) {
    if (!page) page = "1";

    let response = fetch("https://hentai-img.com/search/keyword/" + key + "/page/" + page + "/");
    if (response.ok) {
        let doc = response.html();
        let data = [];

        doc.select("#image-list li").forEach(e => {
            data.push({
                name: e.select(".image-list-item-title a").first().text(),
                link: e.select(".image-list-item-title a").first().attr("href"),
                cover: e.select(".image-list-item-image img").first().attr("src"),
                host: "https://hentai-img.com"
            })
        });

        var next = /\/page\/(\d+)/.exec(doc.select(".nextpostslink").attr("href"));
        if (next) next = next[1];
        else next = "";
        return Response.success(data, next)
    }
    return null;
}