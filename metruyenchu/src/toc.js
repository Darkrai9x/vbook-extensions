load("config.js");

function execute(url) {
    var authorization = getToken();
    if (!authorization) return Response.error(ERROR_MESSAGE);


    var slugMatch = url.match(/\/truyen\/([^/?#]+)/);
    if (!slugMatch) return Response.error("Không tìm thấy slug từ URL: " + url);
    var slug = slugMatch[1];


    var searchRes = fetch(API_HOST + "/api/books/search?keyword=" + encodeURIComponent(slug), {
        headers: apiHeaders(authorization)
    });
    if (!searchRes.ok) return Response.error(ERROR_MESSAGE);
    var searchJson = searchRes.json();
    if (!searchJson.data || searchJson.data.length === 0) return Response.error("Không tìm thấy truyện: " + slug);

    var books = searchJson.data;
    var bookId = null;
    for (var i = 0; i < books.length; i++) {
        if (books[i].slug === slug) {
            bookId = books[i].id;
            break;
        }
    }
    if (!bookId) bookId = books[0].id;


    var tocRes = fetch(API_HOST + "/api/chapters?filter[book_id]=" + bookId, {
        headers: apiHeaders(authorization)
    });
    if (!tocRes.ok) return Response.error(ERROR_MESSAGE);
    var tocJson = tocRes.json();
    if (!tocJson.data) return Response.error(ERROR_MESSAGE);

    var chapters = [];
    tocJson.data.forEach(function (chapter) {
        chapters.push({
            name: chapter.name,
            url: String(chapter.id),  // truyền chapter ID để chap.js dùng thẳng
            host: "https://metruyencv.com/"
        });
    });

    return Response.success(chapters);
}
