load("config.js");

function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let storyId = doc.select("input[name=story]").first().attr("value");
        let json = fetch(BASE_URL.replace("https://", "https://api.") + "/v1/story/" + storyId + "/chapter_list?page=1&new=0").json();
        let lastPage = json.total_page;
        let pages = [];
        for (let i = 1; i <= lastPage; i++) {
            pages.push("v1/story/" + storyId + "/chapter_list?page=" + i + "&new=0");
        }

        return Response.success(pages);
    }

    return null;
}