load("config.js");
function execute(url, page) {
    if (!page) page = '1';
    let tocUrl = BASE_URL2.replace("https://", "https://backend.") + url + "&limit=20&page=" + page;

    let response = fetch(tocUrl, {
        headers: {
            "X-App": "MeTruyenChu"
        },
    });
    if (response.ok) {
        let json = response.json();
        let novelList = [];
        let next = json.pagination.next + "";
        json.data.forEach(book => {
            novelList.push({
                name: book.book.name,
                link: book.book.link,
                description: book.book.author.name,
                cover: book.book.poster['default'],
                host: BASE_URL
            })
        });
        return Response.success(novelList, next);
    }

    return null;
}