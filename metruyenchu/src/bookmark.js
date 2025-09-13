load("config.js");

function execute(url, page) {
    if (!page) page = '1';
    let res = fetch(BASE_URL + url)
    let cookie = res.request.headers.cookie
    let accessToken = cookie.match(/accessToken(.*?);/g)[0].replace(";", "").replace("accessToken=", "")
    let authorization = "Bearer " + accessToken;
    let response = fetch(BASE_URL2.replace("https://", "https://backend.") + "/api/bookmarks?filter[gender]=1&limit=15&page=" + page, {
        "headers": {
            "authorization": authorization,
        }
    });
    if (response.ok) {
        let json = response.json();
        let novelList = [];
        let next = json.pagination.next + "";
        json.data.forEach(e => {
            novelList.push({
                name: e.book.name,
                link: e.book.link,
                cover: e.book.poster['default'],
                host: BASE_URL
            })
        });
        if (novelList.length == 0) {
            return Response.error("Chưa có truyên đã bookmark");
        }
        return Response.success(novelList, next);
    }
    return Response.error("Đăng nhập MTC để xem truyện đã bookmark");
}