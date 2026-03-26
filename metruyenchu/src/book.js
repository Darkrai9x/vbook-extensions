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
        if (!json.data || !json.data[0] || !json.data[0].author || !json.data[0].author.name) return Response.error(ERROR_MESSAGE);
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
