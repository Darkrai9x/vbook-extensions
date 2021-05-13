function execute(url) {
    url = url.replace("hentaivn.net", "hentaivn.tv");
    const http = Http.get(url);
    var cookies = http.cookie();
    if (cookies) {
        var isMobile = cookies.indexOf("mobile=1") >= 0;
        if (isMobile) {
            http.headers({"Cookie": cookies.replace("mobile=1", "mobile=0")})
        }
    }
    var doc = http.html();

    const data = [];

    var el = doc.select(".listing a")
    for (var i = el.size() - 1; i >= 0; i--) {
        var e = el.get(i);
        data.push({
            name: e.text(),
            url: e.attr("href"),
            host: "https://hentaivn.tv"
        })
    }
    

    return Response.success(data);
}