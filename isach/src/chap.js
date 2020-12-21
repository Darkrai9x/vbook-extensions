function execute(url) {
    var doc = Http.get(url).html();
    var e = doc.select("div#motsach_content_body");
    e.select("div#dropcap").tagName("span");
    var htm = e.html();

    var st = htm.indexOf("<div class=\"ms_text\">", htm.lastIndexOf("ms_chapter"));
    var ed = htm.indexOf("<div class=\"navigator_bottom\">");
    if (st < ed) {
        htm = htm.substr(st, ed);
    } else {
        htm = "";
    }
    return Response.success(htm.trim());
}