function execute(url) {
    var doc = Http.get(url).html();
    if (doc) {
        doc.select("noscript").remove();
        doc.select("script").remove();
        doc.select("iframe").remove();
        doc.select("div.ads-responsive").remove();
        doc.select("[style=font-size.0px;]").remove();
        doc.select("a").remove();
        var txt = doc.select("div.chapter-c").html().replace("<em>.*?Chương này có nội dung ảnh.*?</em>", "</?em>");
        return Response.success(txt);
    }
    return null;
}