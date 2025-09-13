load("config.js")

function execute(url, page) {
    if (!page) page = '1';

    let id = /ho-so\/(\d+)\/?/.exec(url)[1];
    let filterUrl = BASE_URL2.replace("https://", "https://backend.") + "/api/books";
    let response = fetch(filterUrl, {
        headers: {
            "X-App": "MeTruyenChu"
        },
        queries: {
            "filter[creator": id,
            "filter[gender]": "1",
            "filter[kind]": "1",
            "filter[state]": "published",
            "include": "author,genres,creator",
            "limit": "5",
            "page": page,
            "sort": "-new_chap_at"
        }
    });
    if (response.ok) {
        let json = response.json();
        let novelList = [];
        let next = json.pagination.next + "";
        json.data.forEach(book => {
            novelList.push({
                name: book.name,
                link: book.link,
                description: book.author.name,
                cover: book.poster['default'],
                host: BASE_URL
            })
        });
        return Response.success(novelList, next);
    }

    return null;
}