load("config.js");

function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let storyId = doc.select("input[name=story]").first().attr("value");
        let firstDoc = fetch(BASE_URL + "/load-list-chapter?story=" + storyId + "&new=0").html();
        let lastPage = parseInt(firstDoc.select(".jum-box").attr("data-lastpage"));
        let pages = [];
        for (let i = 1; i <= lastPage; i++) {
            pages.push("/load-list-chapter?story=" + storyId + "&page=" + i);
        }

        return Response.success(pages);
    }

    return null;
}