function execute(url) {
    url = url.replace("hentaivn.net", "hentaivn.tv");
    url = url.replace("hentaivn.tv", "hentaivn.moe");

    let response = fetch(url);
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
                host: "https://hentaivn.tv",
                ongoing: info.html().indexOf("Đã hoàn thành") === -1,
                nsfw: true
            });
        } else {
            let info = doc.select(".content-info");
            info.select("script").remove();
            return Response.success({
                name: info.select("h3 a").first().text(),
                cover: doc.select(".content-images-1 img").first().attr("src"),
                author: doc.select("a[href~=tacgia]").first().text(),
                description: info.first().html(),
                host: "https://hentaivn.tv",
                ongoing: info.html().indexOf("Đã hoàn thành") === -1,
                nsfw: true
            });
        }

    }

    return null;
}