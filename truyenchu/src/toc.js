load('config.js');
function execute(url) {
    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        let bookId = doc.select("#truyen-id").attr("value");
        let bookName = doc.select("h1.story-title").text();
        response = fetch(BASE_URL + '/api/services/chapter-option?type=chapter_option&data=' + bookId);

        if (response.ok) {
            doc = response.html();
            let chapList = [];
            doc.select("option").forEach(e => {
                chapList.push({
                    name: e.text().replace(bookName + " - ", ""),
                    url: url + "/" + e.attr("value"),
                    host: BASE_URL
                });
            });

            return Response.success(chapList);
        }

    }

    return null;

}