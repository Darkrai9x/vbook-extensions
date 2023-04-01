load('config.js');

function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        return Response.success({
            name: doc.select("h1.story-title").text(),
            cover: doc.select("div.book img").attr("src"),
            author: doc.select("div.info div a").first().text(),
            description: doc.select("div.desc-text").html(),
            detail: doc.select("div.info").html(),
            ongoing: doc.select("div.info").html().indexOf(">Đang ra<") > 0,
            host: "http://truyenchu.vn"
        });
    }
    return null;
}