function execute(url) {
    var storyId = url.match(/\/(\d+)-/)[1];
    var data = Http.get("https://www.wattpad.com/api/v3/stories/" + storyId).string();

    if (data) {
        data = JSON.parse(data);
        var list = [];
        data.parts.forEach(v => {
            list.push({
                name: v.title,
                url: v.url
            });
        });
        return Response.success(list);
    }

    return null;
}
