load('config.js');

function execute(key, page) {
    if (!page) page = '0';
    let response = fetch(BASE_URL + "/reader/search?ten=" + key + "&page=" + page);
    if (response.ok) {
        let doc = response.html();
        if (doc.select("title").text().includes("Đăng nhập để đọc truyện")) {
            return Response.error("Bạn cần đăng nhập hoặc tạo tài khoản mới để tiếp tục đọc truyện.");
        }
        let next = doc.select(".pager-next").last().select("a").attr("href").match(/page=(\d+)/);
        if (next) next = next[1];

        let novelList = [];
        doc.select("div.view-content li.search-row").forEach(e => novelList.push({
            name: e.select("div.search-truyen a").text(),
            link: e.select("div.search-truyen a").attr("href"),
            cover: e.select("div.search-anhbia img").attr("src"),
            description: e.select("div.search-tacgia a").text(),
            host: BASE_URL
        }));

        return Response.success(novelList, next);
    }
    return null;
}
