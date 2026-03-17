load("config.js");

function execute(url, page) {
    if (!page) page = '1';
    var authorization = getToken();
    if (!authorization) return Response.error(ERROR_MESSAGE);
    var response = fetch(API_HOST + "/api/bookmarks?filter[gender]=1&limit=15&page=" + page, {
        headers: apiHeaders(authorization)
    });
    if (response.ok) {
        var json = response.json();
        console.log(JSON.stringify(json));
        var novelList = [];
        var next = json.pagination ? json.pagination.next + "" : "";
        if (!json.data[0] || !json.data[0].book.name || !json.data[0].book.link) return Response.error(ERROR_MESSAGE);
        json.data.forEach(function (e) {
            novelList.push({
                name: e.book.name,
                link: e.book.link + "/" + e.book.id,
                cover: e.book.poster['default'],
                host: BASE_URL
            });
        });
        if (novelList.length === 0) {
            return Response.error("Chưa có truyện đã bookmark");
        }
        return Response.success(novelList, next);
    }
    return Response.error("Đăng nhập MTC để xem truyện đã bookmark");
}
