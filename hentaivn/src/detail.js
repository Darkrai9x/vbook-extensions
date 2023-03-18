load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL)
    let response = fetch(url, {
        headers: {
            "referer": BASE_URL
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
                host: BASE_URL,
                ongoing: info.html().indexOf("Đã hoàn thành") === -1,
                nsfw: true
            });
        } else {
            let nameInfo = fetch(BASE_URL + "/" + doc.html().match(/(list-info-ten-mobile.php.*?)\"/)[1]).html();
            let fullInfo = fetch(BASE_URL + "/"+ doc.html().match(/(list-info-all-mobile.php.*?)\"/)[1]).html();
            return Response.success({
                name: nameInfo.select("h3").first().text(),
                cover: doc.select(".content-images-1 img").first().attr("src"),
                author: fullInfo.select("a[href~=tacgia]").text(),
                description: fullInfo.html(),
                host: BASE_URL,
                ongoing: fullInfo.html().indexOf("Đã hoàn thành") === -1,
                nsfw: true
            });
        }

    }

    return null;
}