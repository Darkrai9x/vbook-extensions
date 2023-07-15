load("config.js");
load("crypto.js");

function execute(key, page) {
    if (!page) {
        page = "1";
    }

    let path = "/search/book?q=" + encodeURIComponent(key) + "&total_chapter=-1&time_filter=0&month=0&year=0&page=" + page + "&sort=0&count=10";
    let response = fetch(BASE_URL + path, {
        headers: createHeaders(path)
    });
    if (response.ok) {
        let books = [];

        let data = response.json().data
        data.books.forEach(e => {
            let tag = e.attr_gender.name;
            books.push({
                name: e.title_vi,
                link: BASE_URL + "/book/" + e.id,
                cover: e.cover,
                description: tag + ", " + e.attr_status.name,
            });
        });

        let lastPage = data.last_page;
        let currentPage = parseInt(page);
        if (currentPage < lastPage) {
            return Response.success(books,  Math.trunc(parseInt(page) + 1) + "");
        } else {
            return Response.success(books, null);
        }
    }

    return null;
}