function execute(url) {
    var doc = Http.get(url).html();
    if (doc) {
        var info = doc.select(".detail_infos");
        return Response.success({
            name: info.select(".title").text(),
            cover: doc.select(".detail_info img").first().attr("src"),
            host: "https://www.medoctruyenchu.net",
            author: info.select(".other_infos font").first().text(),
            description: info.select(".summary").last().html(),
            detail: info.select(".other_infos").first().html(),
            ongoing: info.html().indexOf("Đang tiến hành") >= 0,
            url: url.replace("m.medoctruyenchu.net", "www.medoctruyenchu.net")
        });
    }
    return null;
}