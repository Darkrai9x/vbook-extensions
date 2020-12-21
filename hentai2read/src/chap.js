function execute(url) {
    var doc = Http.get(url).string();
    const regex = /'images' : (\[.+\])/g;
    const arr = regex.exec(doc);
    const links = JSON.parse(arr[1]);

    const data = links.map((s, i) => {
        return 'https://static.hentaicdn.com/hentai' + s
    });

    return Response.success(data);
}