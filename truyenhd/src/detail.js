load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        return Response.success({
            name: doc.select("h1").text(),
            cover: doc.select(".book3d img").first().attr("data-src"),
            host: BASE_URL,
            author: doc.select("a[href*=tac-gia]").first().text(),
            description: doc.select(".gioi_thieu").html(),
            detail: doc.select("#thong_tin").html(),
            ongoing: doc.select("#thong_tin").html().indexOf("Đang Cập Nhật") >= 0
        });
    }
    return null;
}