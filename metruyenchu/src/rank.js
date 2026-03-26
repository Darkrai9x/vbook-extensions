load("config.js");
function execute(url, page) {
    if (!page) page = '1';
    var authorization = getToken();
    if (!authorization) return Response.error(ERROR_MESSAGE);
    var apiUrl = API_HOST + url + "&limit=20&page=" + page;
    var response = fetch(apiUrl, {
        headers: apiHeaders(authorization)
    });
    if (response.ok) {
        var json = response.json();
        var novelList = [];
        var next = json.pagination ? json.pagination.next + "" : "";
        json.data.forEach(function (book) {
            novelList.push({
                name: book.book.name,
                link: book.book.link + "/" + book.book.id,
                description: book.book.author.name,
                cover: book.book.poster['default'],
                host: BASE_URL
            });
        });
        return Response.success(novelList, next);
    }

    return null;
}
