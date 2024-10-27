load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();

        let chapList = [];
        doc.select("#chapter-list-container .chapter-list-inner tr > .list-chapter__name > a").forEach(e => {
            chapList.push({
                name: e.text(),
                url: e.attr("href"),
                host: BASE_URL
            })
        })
        return Response.success(chapList);
    }

    return null;
}