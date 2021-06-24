function execute(url) {
    var storyId = url.match(/\/(\d+)-/)[1];
    var data = Http.get("https://www.wattpad.com/api/v3/stories/" + storyId).string();

    if (data) {
        data = JSON.parse(data);

        return Response.success({
            name: data.title,
            cover: data.cover,
            host: "https://www.wattpad.com",
            author: data.user.name,
            description: data.description,
            url: data.url,
            detail: data.user.name,
        });
    }
    return null;
}
