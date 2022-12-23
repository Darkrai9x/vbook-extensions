function execute(url, page) {
    load('config.js');
    if (!page) page = 1;

    var response = fetch("https://truyenazz.vn/ajax/list-story", {
        method : "POST",
        body : {
            page : page,
            slug : url
        }
    });

    if (response.ok) {
        var json = response.json();
        var lmm = json.html
        var next = page + 1;
        var hml  = Html.parse(lmm.replace(/<tr/g,"<ul").replace(/tr>/g,"ul>").replace(/<td/g,"<li").replace(/td>/g,"li>"))
        let el = hml.select("ul")
        var novelList = [];
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
                novelList.push({
                    name: e.select(".info h3 a").text(),
                    link: e.select(".info h3 a").attr("href"),
                    description: e.select(".info > p:nth-child(5)").text(),
                    cover: e.select(".image-book").first().attr("data-src"),
                    host: BASE_URL,
                });

            }
        return Response.success(novelList, next);
    }
    return null;
}