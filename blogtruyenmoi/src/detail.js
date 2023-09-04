load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        doc.select(".fb-page").remove();
        let author = doc.select("a[href*=/tac-gia/]").first().text();
        return Response.success({
            name: doc.select("title").text().replace(/\s*\|\s*BlogTruyenMoi.Com/, ""),
            cover: doc.select(".thumbnail img").first().attr("src"),
            host: BASE_URL,
            author: author,
            description: doc.select(".detail > .content").html(),
            detail: doc.select(".description").last().html(),
            ongoing: doc.select(".description").last().html().indexOf("Đang tiến hành") >= 0
        });
    }
    return null;
}