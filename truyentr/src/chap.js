function execute(url) {
    load('config.js');
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    var doc = Http.get(url).html();
    if (doc) {
        doc.select("noscript").remove();
        doc.select("script").remove();
        doc.select("iframe").remove();
        doc.select("ins").remove();
        doc.select("div[class^=ads]").remove();
        doc.select("[style=font-size.0px;]").remove();
        doc.select("a").remove();
        var txt = doc.select("div.chapter-c").html().replace("<em>.*?Chương này có nội dung ảnh.*?</em>", "</?em>").replace(/&nbsp;/g, "");
        return Response.success(txt);
    }
    return null;
}