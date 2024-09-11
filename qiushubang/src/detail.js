load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url + "/");

    if (response.ok) {
        let doc = response.html();
        return Response.success({
            name: doc.select(".info h1").first().text(),
            cover: doc.select(".imgbox img").first().attr("src"),
            author: doc.select(".info a[href~=author]").text(),
            description: doc.select(".info .desc").html(),
            detail: doc.select(".info .top .fix").html(),
            host: BASE_URL,
        });
    }
    return null;
}