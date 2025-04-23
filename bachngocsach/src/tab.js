load('config.js');
function execute(url, page) {
    if (!page) page = '0';

    let response = fetch(url + "/?page=" + page);
    if (response.ok) {
        let doc = response.html();
        if (doc.select("title").text().includes("Đăng nhập để đọc truyện")) {
            return Response.error("Bạn cần đăng nhập hoặc tạo tài khoản mới để tiếp tục đọc truyện.");
        }
        let next = doc.select(".pager-next").last().select("a").attr("href").match(/page=(\d+)/);
        if (next) next = next[1];

        let novelList = [];
        doc.select("ul.content-grid > li > div").forEach(e => novelList.push({
            name: e.select("div.recent-truyen a").text(),
            link: e.select("div.recent-truyen a").attr("href"),
            cover: e.select("div.recent-anhbia img").attr("src"),
            description: e.select("div.recent-chuong a").text(),
            host: BASE_URL
        }));
        return Response.success(novelList, next);
    }
    return null;
}