function execute(url) {
    url = url.replace("hentaivn.net", "hentaivn.tv");
    url = url.replace("hentaivn.tv", "hentaivn.moe");
    url = url.replace("hentaivn.moe", "hentaivn.fun");
    url = url.replace("hentaivn.fun", "hentaivn.la");
    url = url.replace("hentaivn.la", "hentaivn.in");
    let response = fetch(url, {
        headers: {
            "referer": "https://hentaivn.in"
        }
    });
    if (response.ok) {
        let doc = response.html();

        let isMobile = doc.select(".header-logo").size() !== 0;
     
        if (!isMobile) {
            let info = doc.select(".page-info");
            return Response.success({
                name: info.select("h1").first().text(),
                cover: doc.select(".page-ava img").first().attr("src"),
                author: doc.select("a[href~=tacgia]").first().text(),
                description: info.first().html(),
                host: "https://hentaivn.in",
                ongoing: info.html().indexOf("Đã hoàn thành") === -1,
                nsfw: true
            });
        } else {
            let nameInfo = fetch("https://hentaivn.la/" + doc.html().match(/(list-info-ten-mobile.php.*?)\"/)[1]).html();
            let fullInfo = fetch("https://hentaivn.la/" + doc.html().match(/(list-info-all-mobile.php.*?)\"/)[1]).html();
            return Response.success({
                name: nameInfo.select("h3").first().text(),
                cover: doc.select(".content-images-1 img").first().attr("src"),
                author: fullInfo.select("a[href~=tacgia]").text(),
                description: fullInfo.html(),
                host: "https://hentaivn.in",
                ongoing: fullInfo.html().indexOf("Đã hoàn thành") === -1,
                nsfw: true
            });
        }

    }

    return null;
}