function execute(url) {
    const doc = Http.get(url).html();

    var info = doc.select("#motsach_content_body");
    var el = info.select("div.ms_text");
    var des = "";
    for (var i = 0; i < el.size(); i++) {
        des = des + el.get(i).text() + "<br>";
    }
    return Response.success({
        name: info.select("div.ms_title a").first().text(),
        cover: info.select("img.ms_image").first().attr("src"),
        author: info.select("div.ms_author a").first().text(),
        description: des,
        detail: info.select("div.ms_author").html(),
        host: "https://isach.info"
    });
}