load("config.js");

function execute(url) {
    let storyId = url.split('/').pop();
    let api_page = BASE_URL.replace("https://", "https://api.") + "/v1/story/" + storyId + "/chapter_list?page=1&new=0"
    let json = fetch(api_page).json();
    let lastPage = json.total_page;
    let pages = [];
    for (let i = 1; i <= lastPage; i++) {
        pages.push("v1/story/" + storyId + "/chapter_list?page=" + i + "&new=0");
    }

    return Response.success(pages);
}