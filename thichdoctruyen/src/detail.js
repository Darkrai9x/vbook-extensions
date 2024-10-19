load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        return Response.success({
            name: doc.select("h1.h1truyen").text(),
            cover: doc.select("div.book img[itemprop=image]").attr("src"),
            host: BASE_URL,
            author: doc.select("a[itemprop=author]").text(),
            description: doc.select("div#viewtomtat2").html(),
            detail: doc.select("div.thongtintruyen1 .truyenp1").html(),
            ongoing: doc.select(".truyenp1").html().indexOf(" Còn Tiếp...") >= 0
        });
    }

    return null;
}
