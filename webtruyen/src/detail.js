load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    var doc = Http.get(url).html().select("#story-detail");

    return Response.success({
        name: doc.select("h1.title").first().text(),
        cover: doc.select(".thumb img").first().attr("src"),
        author: doc.select("a[itemprop=author]").text(),
        description: doc.select(".description").html(),
        detail: doc.select(".infos").html(),
        host: BASE_URL,
        ongoing: doc.select(".infos").html().indexOf("Đang cập nhật") >= 0
    });
}