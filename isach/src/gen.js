function execute(url, page) {
    if (!page) page = '1';
    const doc = Http.get(url + "&order=story_id&page=" + page).html();

    var next = doc.select(".pagination").first().select("a.navigator");

    if (next.size() > 1) {
        next = next.last().attr("href").match(/page=(\d+)/)
        if (next) next = next[1];
        else next = "";
    } else {
        next = "";
    }

    const el = doc.select(".story_content_list .ms_list_item")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        var cover = e.select(".left_list_item a").last().attr("href").match(/story=(.*?)$/);
        data.push({
            name: e.select(".left_list_item a").last().text(),
            link: e.select(".left_list_item a").last().attr("href"),
            cover: cover ? ("/images/story/cover/" + cover[1] + ".jpg") : "",
            description: e.select(".right_list_item a").text(),
            host: "https://isach.info"
        })
    }

    return Response.success(data, next)
}