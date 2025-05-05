load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var doc = Http.get(url).html();
    if (doc) {
        var cover = doc.select(".series-cover .img-in-ratio").first().attr("style").match(/url.'(.*?)'/);
        if (cover) cover = cover[1]; else cover = '';

        return Response.success({
            name: doc.select(".series-name").text(),
            cover: cover,
            host: BASE_URL,
            author: doc.select(".series-information .info-item a").first().text(),
            description: doc.select(".summary-content").html(),
            detail: doc.select(".series-information .info-item").html(),
            ongoing: doc.select(".series-information .info-item").html().indexOf("truyen-dang-tien-hanh") > 0
        });
    }
}