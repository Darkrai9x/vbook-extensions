function execute(url, page) {
    if (!page) page = '1';

    var doc = Http.get(url + "-" + page).html();

    if (doc) {
        var el = doc.select(".list-mainpage .storyitem");
        var novelList = [];
        var next = doc.select(".pagination").select("li:has(.glyphicon-step-forward)").last().select("a").attr("href").match(/-(\d+)/);
        if (next) next = next[1]; else next = '';
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            novelList.push({
                name: e.select(".title a").attr("title"),
                link: e.select(".title a").first().attr("href"),
                description: e.select(".statictis").last().text(),
                cover: e.select("img").first().attr("src"),
                host: "https://blogtruyen.vn"
            });
        }

        return Response.success(novelList, next)
    }
    return null;
}