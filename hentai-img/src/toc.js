function execute(url) {
    let id = /hentai-img.com\/(image|story)\/([a-z0-9-]+)\/?/.exec(url);

    if (id) id = id[2];
    let response = fetch("https://hentai-img.com/image/" + id + "/");

    let data = [];
    data.push({
        name: response.html().select("#title").text(),
        url: "https://hentai-img.com/story/" + id
    })

    return Response.success(data);
}