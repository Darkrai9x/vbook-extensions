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
            let genres = [];
            info.select("a.tag").forEach(e => {
               genres.push({
                   title: e.text(),
                   input: BASE_URL + e.attr("href"),
                   script: "gen.js"
               })
            });
            let detail = "";
            info.select("p").forEach(e => {
                let text = e.text();
                if (text.indexOf("Thể Loại") == -1) {
                    detail += text + "<br>"
                }
            });

            return Response.success({
                name: info.select("h1").first().text(),
                cover: doc.select(".page-ava img").first().attr("src"),
                author: doc.select("a[href~=tacgia]").first().text(),
                description: detail,
                host: BASE_URL,
                genres: genres,
                ongoing: info.html().indexOf("Đã hoàn thành") === -1,
                nsfw: true
            });
        } else {
            let nameInfo = fetch(BASE_URL + "/" + doc.html().match(/(list-info-ten-mobile.php.*?)\"/)[1]).html();
            let fullInfo = fetch(BASE_URL + "/"+ doc.html().match(/(list-info-all-mobile.php.*?)\"/)[1]).html();
            let genreInfo = fetch(BASE_URL + "/"+ doc.html().match(/(list-info-theloai-mobile.php.*?)\"/)[1]).html();
            let genres = [];
            genreInfo.select("a.tag").forEach(e => {
                genres.push({
                    title: e.text(),
                    input: BASE_URL + e.attr("href"),
                    script: "gen.js"
                })
            });
            return Response.success({
                name: nameInfo.select("h3").first().text(),
                cover: doc.select(".content-images-1 img").first().attr("src"),
                author: fullInfo.select("a[href~=tacgia]").text(),
                description: fullInfo.html(),
                host: BASE_URL,
                genres: genres,
                ongoing: fullInfo.html().indexOf("Đã hoàn thành") === -1,
                nsfw: true
            });
        }

    }

    return null;
}