function execute(url) {
    url = url.replace("ln.hako.re","ln.hako.vn");
    var doc = Http.get(url).html();
    if (doc) {
        var cover = doc.select(".series-cover .img-in-ratio").first().attr("style").match(/url.'(.*?)'/);
        if (cover) cover = cover[1]; else cover = '';

        return Response.success({
            name: doc.select(".series-name").text(),
            cover: cover,
            host: "https://ln.hako.vn",
            author: doc.select(".series-information .info-item a").first().text(),
            description: doc.select(".summary-content").html(),
            detail: doc.select(".series-information .info-item").html(),
            ongoing: doc.select(".series-information .info-item").html().indexOf("truyen-dang-tien-hanh") > 0
        });
    }
}