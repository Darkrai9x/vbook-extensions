load("config.js");
load("crypto.js");

function execute(url, page) {
    if (!page) {
        page = "1";
    }

    let path = "";
    if (url.endsWith("?")) {
        path = url + "page=" + page + "&count=20"
    } else {
        path = url + "&page=" + page + "&count=20"
    }
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
            return Response.success(books, Math.trunc(parseInt(page) + 1) + "");
        } else {
            return Response.success(books, null);
        }
    }

    return null;
}