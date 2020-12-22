function execute(url) {
    const http = Http.get(url);
    const doc = http.html();
    var cookies = http.cookie();

    var isMobile = false;

    if (cookies) {
        isMobile = cookies.indexOf("mobile=1") > 0;
    }

    if (isMobile) {
        doc.select("noscript").remove();
        var info = doc.select(".content-row");
        var img = info.select(".content-images-1 img").first().attr("data-cfsrc")
        if (!img) {
            img = info.select(".content-images-1 img").first().attr("src")
        }
        return Response.success({
            name: info.select(".content-info a").first().text(),
            cover: img,
            author: info.select("a[href~=tacgia]").first().text(),
            description: info.select(".content-info").html(),
            host: "https://hentaivn.net",
            ongoing: info.select(".content-info").html().indexOf("Đã hoàn thành") === -1,
            nsfw: true
        });
    } else {
        var info = doc.select(".page-info");
        return Response.success({
            name: info.select("h1").first().text(),
            cover: doc.select(".page-ava img").first().attr("src"),
            author: doc.select("a[href~=tacgia]").first().text(),
            description: info.html(),
            host: "https://hentaivn.net",
            ongoing: info.html().indexOf("Đã hoàn thành") === -1,
            nsfw: true
        });
    }
}