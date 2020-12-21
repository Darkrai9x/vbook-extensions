function execute(url) {
    const http = Http.get(url);
    var doc = http.html();

    var cookies = http.cookie();

    var isMobile = false;

    if (cookies) {
        isMobile = cookies.indexOf("mobile=1") > 0;
    }
    const data = [];
    if (isMobile) {
        var el = doc.select(".episodes a")

        for (var i = el.size() - 1; i >= 0; i--) {
            var e = el.get(i);
            data.push({
                name: e.text(),
                url: e.attr("href"),
                host: "https://hentaivn.net"
            })
        }
    } else {
        var el = doc.select(".listing a")
        for (var i = el.size() - 1; i >= 0; i--) {
            var e = el.get(i);
            data.push({
                name: e.text(),
                url: e.attr("href"),
                host: "https://hentaivn.net"
            })
        }
    }

    return Response.success(data);
}