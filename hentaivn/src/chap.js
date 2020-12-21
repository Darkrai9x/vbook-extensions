function execute(url) {
    const http = Http.get(url);
    const doc = http.html();
    var cookies = http.cookie();

    var isMobile = false;

    if (cookies) {
        isMobile = cookies.indexOf("mobile=1") > 0;
    }
    var data = [];
    if (isMobile) {
        doc.select("noscript").remove();
        var el = doc.select("#image img");

        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            var img = e.attr("data-cfsrc");
            if (!img) {
                img = e.attr("src")
            }
            data.push(img);

        }
    } else {
        var el = doc.select("#image img");
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            data.push(e.attr("src"));
        }
    }
    return Response.success(data);
}