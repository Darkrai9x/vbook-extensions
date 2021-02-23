function execute(url) {
    const http = Http.get(url);
    var cookies = http.cookie();
    if (cookies) {
        var isMobile = cookies.indexOf("mobile=1") > 0;
        if (isMobile) {
            http.headers({"Cookie": cookies.replace("mobile=1", "mobile=0")})
        }
    }
    const doc = http.html();


    var info = doc.select(".page-info");
    return Response.success({
        name: info.select("h1").first().text(),
        cover: doc.select(".page-ava img").first().attr("src"),
        author: doc.select("a[href~=tacgia]").first().text(),
        description: info.first().html(),
        host: "https://hentaivn.net",
        ongoing: info.html().indexOf("Đã hoàn thành") === -1,
        nsfw: true
    });

}