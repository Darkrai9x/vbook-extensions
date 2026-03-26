load("config.js");

/**
 * Lấy thông tin chi tiết sách từ API android.lonoapp.net.
 * url dạng: https://metruyencv.biz/truyen/<slug>/<book_id>   ← từ book/rank/bookmark/search.js
 *       hoặc: https://metruyencv.biz/truyen/<slug>            ← từ người dùng mở URL trực tiếp
 */
function execute(url) {
    var authorization = getToken();
    if (!authorization) return Response.error(ERROR_MESSAGE);

    var bookId = null;


    var idMatch = url.match(/\/(\d+)(?:[/?#].*)?$/);
    if (idMatch) {
        bookId = idMatch[1];
    } else {

        var slugMatch = url.match(/\/truyen\/([^/?#]+)/);
        if (!slugMatch) return Response.error("Không tìm thấy thông tin từ URL: " + url);
        var slug = slugMatch[1];

        var searchRes = fetch(API_HOST + "/api/books/search?keyword=" + encodeURIComponent(slug), {
            headers: apiHeaders(authorization)
        });
        if (!searchRes.ok) return Response.error(ERROR_MESSAGE);
        var searchJson = searchRes.json();
        if (!searchJson.data || searchJson.data.length === 0) return Response.error("Không tìm thấy truyện: " + slug);

        var books = searchJson.data;
        for (var i = 0; i < books.length; i++) {
            if (books[i].slug === slug) { bookId = books[i].id; break; }
        }
        if (!bookId) bookId = books[0].id;
    }


    var detailRes = fetch(API_HOST + "/api/books/" + bookId + "?include=author,genres,tags,creator", {
        headers: apiHeaders(authorization)
    });
    if (!detailRes.ok) return Response.error(ERROR_MESSAGE);
    var book = detailRes.json().data;
    if (!book) return Response.error(ERROR_MESSAGE);


    var genres = [];
    if (book.genres) {
        book.genres.forEach(function (g) {
            genres.push({
                title: g.name,
                input: "/api/books?filter%5Bgender%5D=1&filter%5Bgenres.id%5D=" + g.id + "&filter%5Bkind%5D=1&filter%5Bstate%5D=published&include=author%2Cgenres%2Ccreator&sort=-new_chap_at",
                script: "book.js"
            });
        });
    }


    var kindMap = { '1': 'Chuyển ngữ', '2': 'Sáng tác' };
    var kind = kindMap[String(book.kind)] || book.kind || '';
    var sex = book.sex === 1 ? 'Nam' : 'Nữ';
    var tags = book.tags ? book.tags.map(function (t) { return t.name; }).join(', ') : '';
    var authorName = book.author
        ? (book.author.name + (book.author.local_name ? ' (' + book.author.local_name + ')' : ''))
        : '';

    var info = [
        "Loại: " + kind,
        "Đối tượng: " + sex,
        "Trạng thái: " + (book.status_name || ''),
        "Đánh giá: " + (book.review_score || '') + " ⭐ (" + (book.review_count || 0) + " lượt)",
        "Đề cử: " + (book.vote_count || 0),
        "Tags: " + (tags || '—')
    ].join("<br>");

    return Response.success({
        name: book.name,
        cover: (book.poster && (book.poster['600'] || book.poster['default'])) || '',
        host: BASE_URL,
        author: authorName,
        description: book.synopsis || '',
        detail: info,
        ongoing: book.status !== 2,
        genres: genres,
    });
}
