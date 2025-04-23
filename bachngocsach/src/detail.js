load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        if (doc.select("title").text().includes("Đăng nhập để đọc truyện")) {
            return Response.error("Bạn cần đăng nhập hoặc tạo tài khoản mới để tiếp tục đọc truyện.");
        }
        let genres = [];
        doc.select("#theloai a").forEach(e => {
            genres.push({
                title: e.text(),
                input: BASE_URL + e.attr("href"),
                script: "gen.js"
            });
        });
        return Response.success({
            name: doc.select("h1#truyen-title").text(),
            cover: doc.select("div#anhbia img").attr("src"),
            author: doc.select("div#tacgia a").text(),
            description: doc.select("div#gioithieu .block-content").html(),
            detail: doc.select("flag").text(),
            genres: genres,
            suggests: [
                {
                    title: "Cùng tác giả",
                    input: doc.select(".same_author-list").html(),
                    script: "suggest.js"
                }
            ],
            host: BASE_URL
        });
    }
    return null;
}