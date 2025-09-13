load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url);
    if (response.ok) {
        let bookId = /"id":(\d+)/.exec(response.html().html())[1];
        let tocUrl = BASE_URL2.replace("https://", "https://backend.") + "/api/chapters?filter%5Bbook_id%5D=" + bookId + "&filter%5Btype%5D=published";

        response = fetch(tocUrl, {
            headers: {
                "X-App": "MeTruyenChu"
            }
        }).json();

        let chapters = [];
        response.data.forEach(chapter => {
            chapters.push({
                name: chapter.name,
                url: "chuong-" + chapter.index,
                host: url,
                lock: chapter.is_locked === true
            })
        });
        return Response.success(chapters);
    }

    return null;
}