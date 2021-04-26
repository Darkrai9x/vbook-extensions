function execute(url) {
    const doc = Http.get(url).html();

    var info = doc.select("ul.manga-info");
    const cate = info.select("li:contains(Thể loại) a[href*=danh-sach-truyen-the-loai]");
    const category = [];
    for (var i = 0; i < cate.size(); i++) {
        var e = cate.get(i)
        category.push({
            name: e.text(),
            link: e.attr("href")
        });
    }

    info.select("h3").remove();

    var cover = doc.select("img.thumbnail").first().attr("src");
    if (cover.startsWith("//")) {
        cover = "https:" + cover;
    }
    return Response.success({
        name: doc.select(".info-manga").select("a [itemprop=name]").last().text(),
        cover: cover,
        author: doc.select("li:contains(Tác giả) a").first().text(),
        description: doc.select(".summary-content").html(),
        detail: info.html(),
        category: category,
        ongoing: info.html().indexOf("Đang tiến hành") >= 0,
        host: "https://truyentranhaudio.online"
    });
}