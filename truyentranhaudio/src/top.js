function execute(url, page) {
    if (!page) page = '0';
    const doc = Http.post(url).params({
        "action": "madara_load_more",
        "page": page,
        "template": "madara-core/content/content-archive",
        "vars[orderby]": "meta_value_num",
        "vars[paged]": "1",
        "vars[posts_per_page]": "40",
        "vars[post_type]": "wp-manga",
        "vars[post_status]": "publish",
        "vars[meta_key]": "_latest_update",
        "vars[sidebar]": "right",
        "vars[manga_archives_item_layout]": "big_thumbnail"
    }).html()


    const data = [];

    var el = doc.select(".page-content-listing .page-item-detail")

    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i)
        data.push({
            name: e.select(".post-title h5 a").first().text(),
            link: e.select(".post-title h5 a").first().attr("href"),
            cover: e.select(".item-thumb img").first().attr("src"),
            description: e.select(".chapter-item .chapter").text(),
            host: "https://truyentranhaudio.online"
        })
    }

    return Response.success(data, parseInt(page) + 1)
}