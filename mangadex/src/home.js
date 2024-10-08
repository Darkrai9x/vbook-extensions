load("config.js");

function execute() {
    return Response.success([
        {title: "Lastest Upload", input: API_URL + "/manga?includes[]=cover_art&order[latestUploadedChapter]=desc&includedTagsMode=AND&excludedTagsMode=OR", script: "news.js"},
        {title: "Highest Rating", input: API_URL + "/manga?includes[]=cover_art&order[rating]=desc&includedTagsMode=AND&excludedTagsMode=OR", script: "news.js"},
        {title: "Most Follows", input: API_URL + "/manga?includes[]=cover_art&order[followedCount]=desc&includedTagsMode=AND&excludedTagsMode=OR", script: "news.js"},
    ]);
}