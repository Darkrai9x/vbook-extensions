load("config.js");

function execute(key, page) {
    if (!page) page = '1';
    var authorization = getToken();
    if (!authorization) return Response.error(ERROR_MESSAGE);
    var searchUrl = API_HOST + "/api/books/search";
    var response = fetch(searchUrl, {
        headers: apiHeaders(authorization),
        queries: {
            "keyword": key,
            "page": page,
        }
    });
    if (response.ok) {
        var json = response.json();
        var novelList = [];
        var next = json.pagination ? json.pagination.next + "" : "";
        json.data.forEach(function (book) {
            novelList.push({
                name: book.name,
                link: book.link + "/" + book.id,
                description: book.author.name,
                cover: book.poster['default'],
                host: BASE_URL
            });
        });
        return Response.success(novelList, next);
    }

    return null;
}
