function execute(url, page) {
    if (!page) page = '1';

    let response = fetch(url + "-" + page);

    if (response.ok) {
        let doc = response.html();

        let next = doc.select(".pagination").select("li:has(.glyphicon-step-forward)").last().select("a").attr("href").match(/-(\d+)/);
        if (next) next = next[1]; else next = '';
        let novelList = [];
        doc.select(".list-mainpage .storyitem").forEach(e => novelList.push({
            name: e.select(".title a").attr("title"),
            link: e.select(".title a").first().attr("href"),
            description: e.select(".statictis").last().text(),
            cover: e.select("img").first().attr("src"),
            host: "https://blogtruyen.vn"
        }));
        return Response.success(novelList, next)
    }
    return null;
}