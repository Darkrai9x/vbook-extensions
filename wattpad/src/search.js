function execute(key, page) {
    if (!page) page = '0';

    var data = Http.get("https://www.wattpad.com/v4/search/stories").params({
        query: key,
        fields: "stories(id,title,url,cover,user(name))",
        offset: page,
        limit: "10"
    }).string();

    if (data) {
        data = JSON.parse(data);
        var next = data.nextUrl.match(/offset=(\d+)/);
        if (next) next = next[1]; else next = '';

        var novelList = [];
        data.stories.forEach(v => {
            novelList.push({
                name: v.title,
                link: v.url,
                cover: v.cover,
                description: v.user.name
            });
        });
        return Response.success(novelList, next);
    }

    return null;
}